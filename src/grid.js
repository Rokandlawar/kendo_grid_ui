import React, { useState, useRef, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import '@progress/kendo-theme-material/dist/all.css';
import {
    GridColumnMenuFilter,
    GridColumnMenuCheckboxFilter,
    GridToolbar
} from '@progress/kendo-react-grid';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import ReactResizeDetector from 'react-resize-detector';
import { parseDate } from '@telerik/kendo-intl';
import $ from 'jquery'

const defaults = {
    columns: [],
    data: [],
    groupable: true,
    aggregates: false,
    sortable: true,
    pageable: true,
    total: 0
}

function App(props) {

    const [gridProps, setGridProps] = useState(defaults)
    const { columns, data, groupable, aggregates, sortable, pageable, ...otherProps } = gridProps

    const aggregatesCol = useRef({})

    const handleGroupable = (groupable, aggregates) => {
        if (groupable && aggregates) return { footer: 'visible' }
        else return groupable
    }

    const handleAggregates = (aggregates, columns) => {
        if (aggregates) {
            return columns.filter(each => each.type === 'numeric').reduce((accum, each) => {
                const { field } = each
                aggregatesCol.current[field] = field
                return accum.concat([
                    {
                        field: field,
                        aggregate: 'sum'
                    },
                    {
                        field: field,
                        aggregate: 'average'
                    }
                ])
            }, [])
        }
        else return null
    }

    const createDataState = (dataState) => {
        const groups = dataState.group;
        if (groups) {
            groups.map(group => (group.aggregates = aggregates));
        }
        return {
            result: process(data, dataState),
            dataState: dataState
        };
    }

    const [state, setState] = useState(() => {
        return createDataState({
            take: 8,
            skip: 0,
            group: []
        });
    })

    const { result, total, dataState } = state

    const cellRender = (tdElement, cellProps) => {
        if (aggregates) {
            if (cellProps.rowType === 'groupFooter') {
                const { field } = cellProps
                if (field === aggregatesCol.current[field]) {
                    return <td key={'field' + 'average'}>
                        <div>
                            Average: {cellProps.dataItem.aggregates[field].average}
                        </div>
                        <div>
                            Sum: {cellProps.dataItem.aggregates[field].sum}
                        </div>

                    </td>

                }
            }
            return tdElement;
        }
        else return tdElement

    }

    const dataStateChange = (event) => {
        setState(createDataState(event.data));
        fetchData(event.data);
    }

    const ColumnMenuCheckboxFilter = (configs) => {
        return (
            <div>
                <GridColumnMenuCheckboxFilter {...configs} data={data} expanded={true} />
            </div>
        );
    }

    const ColumnMenu = (configs) => {
        return (
            <div>
                <GridColumnMenuFilter {...configs} expanded={true} />
            </div>
        );
    }

    const AggregatesCell = (configs) => {
        const total = data.reduce((acc, current) => acc + current[configs.field], 0);
        return (
            <td colSpan={configs.colSpan} style={configs.style}>
                Sum: {total}
            </td>
        );
    }

    const expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        setState({
            ...state,
            result: Object.assign({}, state.result),
            dataState: state.dataState
        });
    }

    const formatDateValues = (data, columns) => {
        const dateColumns = columns.filter(each => each.type === 'date' || each.type === 'datetime')
        return data.map(each => {
            return dateColumns.reduce((accum, e) => {
                const { field } = e
                accum[field] = parseDate(accum[field])
                return accum
            }, each)
        })
    }

    useEffect(() => {
        fetchData(state.dataState)
    }, [])



    const fetchData = (dataState) => {
        const queryStr = `${toDataSourceRequestString(dataState)}`; // Serialize the state.
        const hasGroups = dataState.group && dataState.group.length;

        const base_url = 'http://localhost:59322/api/Values';
        const init = { method: 'GET', accept: 'application/json', headers: {} };

        fetch(`${base_url}?${queryStr}`, init)
            .then(response => response.json())
            .then(({ Data, Total, groupable, aggregates, ...rest }) => {
                let data = Data
                const total = Total
                const { columns } = rest
                const cols = gridProps.columns.length > 0 ? gridProps.columns : (columns && columns.length > 0 ? columns :
                    Object.keys(data[0]).map(each => {
                        return {
                            field: each,
                            title: each
                        }
                    }))


                data = formatDateValues(data, cols)

                setGridProps({
                    ...rest,
                    data: data,
                    columns: cols,
                    groupable: handleGroupable(true, aggregates),
                    aggregates: handleAggregates(aggregates, cols),
                })

                setState({
                    result: hasGroups ? translateDataSourceResultGroups(data) : data,
                    total,
                    dataState
                });

            });
    }

    const exportExcelRef = useRef(null)

    const exportExcel = () => {
        exportExcelRef.current.save();
    }

    console.log('grid props,state', gridProps, state)
    if (columns.length > 0) return (
        <div style={{ height: 'calc(100% - 100px)' }}>
            <ReactResizeDetector handleWidth handleHeight>
                {
                    (width, height) =>
                        <ExcelExport
                            data={data}
                            ref={exporter => exportExcelRef.current = exporter}
                        >
                            <Grid
                                style={{ height: $(document).height() - 100, width: width }}
                                data={result}
                                {...dataState}
                                total={total}
                                onDataStateChange={dataStateChange}
                                sortable={sortable}
                                pageable={pageable}
                                pageSize={dataState.take}
                                groupable={groupable}
                                onExpandChange={expandChange}
                                expandField="expanded"
                                cellRender={cellRender}
                            >
                                <GridToolbar>
                                    <button
                                        title="Export Excel"
                                        className="k-button k-primary"
                                        onClick={exportExcel}
                                    >
                                        Export to Excel
                                </button>
                                </GridToolbar>
                                {columns.map(each => {
                                    const { type, field, title, ...otherProps } = each
                                    const footerCell = aggregates ? (type === 'numeric' ? AggregatesCell : null) : null
                                    let dateFormat = "{0:d}"
                                    if (type === 'datetime') dateFormat = "{0:G}"
                                    if (type === 'checkbox') return <Column {...otherProps} field={field} title={title} key={field} columnMenu={ColumnMenuCheckboxFilter} footerCell={footerCell} width={200} />
                                    else if (type === 'date' || type === 'datetime') return <Column {...otherProps} field={field} title={title} filter={type} format={dateFormat} key={field} columnMenu={ColumnMenu} footerCell={footerCell} width={200} />
                                    else return <Column {...otherProps} field={field} title={title} filter={type} key={field} columnMenu={ColumnMenu} footerCell={footerCell} width={200} />
                                })}
                            </Grid>
                        </ExcelExport>
                }
            </ReactResizeDetector>
        </div>
    )

    else return null
}
export default App;
