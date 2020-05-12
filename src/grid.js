import React, { useState, useRef } from 'react';
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


function App(props) {

    const { columns, data, ...otherProps } = props

    const [groupable, setGroupable] = useState(() => {
        const { grouping, aggregates } = otherProps
        if (grouping && aggregates) return { footer: 'visible' }
        else return grouping
    })

    const aggregatesCol = useRef({})

    const [aggregates, setAggregates] = useState(() => {
        const { aggregates } = props
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

    })

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


    const cellRender = (tdElement, cellProps) => {
        const { aggregates } = props
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
        //fetchData(event.data);
    }

    const expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        setState({
            result: Object.assign({}, state.result),
            dataState: state.dataState
        });
    }

    const ColumnMenuCheckboxFilter = (configs) => {
        console.log('filter props---', configs)
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

    // useEffect(() => {
    //     fetchData(state.dataState)
    // }, [])

    const fetchData = (dataState) => {
        const queryStr = `${toDataSourceRequestString(dataState)}`; // Serialize the state.
        const hasGroups = dataState.group && dataState.group.length;

        const base_url = 'api/Products';
        const init = { method: 'GET', accept: 'application/json', headers: {} };

        fetch(`${base_url}?${queryStr}`, init)
            .then(response => response.json())
            .then(({ data, total }) => {
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

    console.log('grid state', state)
    return (
        <ReactResizeDetector handleWidth handleHeight>
            {({ width, height }) =>
                <ExcelExport
                    data={state.result.data}
                    ref={exporter => exportExcelRef.current = exporter}
                >
                    <Grid
                        style={{ height: 700}}
                        data={state.result}
                        {...state.dataState}
                        onDataStateChange={dataStateChange}
                        sortable={true}
                        pageable={true}
                        pageSize={8}
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
                            if (type === 'checkbox') return <Column {...otherProps} field={field} title={title} key={field} columnMenu={ColumnMenuCheckboxFilter} footerCell={footerCell} />
                            else if (type === 'date') return <Column {...otherProps} field={field} title={title} filter={type} format="{0:d}" key={field} columnMenu={ColumnMenu} footerCell={footerCell} />
                            else return <Column {...otherProps} field={field} title={title} filter={type} key={field} columnMenu={ColumnMenu} footerCell={footerCell} />
                        })}
                    </Grid>
                </ExcelExport>
            }
        </ReactResizeDetector>
    )
}
export default App;
