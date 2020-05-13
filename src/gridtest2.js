import React, { useState, useRef, useEffect } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import '@progress/kendo-theme-material/dist/all.css';
import {
    GridColumnMenuFilter,
    GridColumnMenuCheckboxFilter
} from '@progress/kendo-react-grid';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import ReactResizeDetector from 'react-resize-detector';

const defaults = {
    columns: [],
    result: [],
    groupable: true,
    aggregates: false,
    sortable: true,
    pageable: true,
    dataState: {
        take: 10,
        skip: 0,
        group: [],
    },
    total: 0
}

function App() {

    const [state, setState] = useState(defaults)
    const { columns, result, groupable, aggregates, dataState, sortable, pageable, total, ...otherProps } = state



    const handleGroupable = (grouping, aggregates) => {
        if (grouping && aggregates) return { footer: 'visible' }
        else return grouping
    }

    const aggregatesCol = useRef({})

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
        const { data, total } = process(result, dataState)
        return {
            result: data,
            total: total,
            dataState: dataState
        };
    }

    const cellRender = (tdElement, cellProps) => {
        const { aggregates } = state
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
        const temp = createDataState(event.data)
        console.log('create data state---', temp)
        setState({ ...state, ...temp });
        fetchData(event.data);
    }

    const expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        setState({
            ...state,
            result: Object.assign({}, state.result),
            dataState: state.dataState
        });
    }

    const ColumnMenuCheckboxFilter = (configs) => {
        console.log('filter props---', configs)
        return (
            <div>
                <GridColumnMenuCheckboxFilter {...configs} data={result} expanded={true} />
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
        const total = result.reduce((acc, current) => acc + current[configs.field], 0);
        return (
            <td colSpan={configs.colSpan} style={configs.style}>
                Sum: {total}
            </td>
        );
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
            .then(({ Data, columns, grouping, aggregates, Total, ...rest }) => {
                const data = Data
                const total = Total
                const cols = columns && columns.length > 0 ? columns :
                    Object.keys(data[0]).map(each => {
                        return {
                            field: each,
                            title: each
                        }
                    })
                setState({
                    ...state,
                    ...rest,
                    total: Total,
                    groupable: handleGroupable(true, aggregates),
                    aggregates: handleAggregates(aggregates, cols),
                    result: hasGroups ? translateDataSourceResultGroups(data) : data,
                    columns: cols
                })
            });
    }

    const exportExcelRef = useRef(null)

    const exportExcel = () => {
        exportExcelRef.current.save();
    }

    console.log('grid state', state)
    if (columns.length > 0) return (
        <ReactResizeDetector handleWidth handleHeight>
            {({ width, height }) => <ExcelExport
                data={state.result}
                ref={exporter => exportExcelRef.current = exporter}
            >
                <Grid
                    style={{ height: 700 }}
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
                        if (type === 'checkbox') return <Column field={field} title={title} key={field} columnMenu={ColumnMenuCheckboxFilter} footerCell={footerCell} />
                        else if (type === 'date') return <Column field={field} title={title} filter={type} format="{0:d}" key={field} columnMenu={ColumnMenu} footerCell={footerCell} />
                        else return <Column field={field} title={title} filter={type} key={field} columnMenu={ColumnMenu} footerCell={footerCell} />
                    })}
                </Grid>
            </ExcelExport>

            }
        </ReactResizeDetector>
    )
    else return null
}
export default App;
