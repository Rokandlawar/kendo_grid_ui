import React, { useState, useRef, useEffect } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
//import { Grid } from '@progress/kendo-grid-react-wrapper';
import { process } from '@progress/kendo-data-query';
import '@progress/kendo-theme-material/dist/all.css';
import {
    GridColumnMenuFilter,
    GridColumnMenuCheckboxFilter
} from '@progress/kendo-react-grid';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import ReactResizeDetector from 'react-resize-detector';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import { parseDate, formatDate } from '@telerik/kendo-intl';
import { filterBy } from '@progress/kendo-data-query';
import useDeepCompareEffect from 'use-deep-compare-effect'

function App(props) {

    const formatDateValues = (data, columns) => {
        const dateColumns = columns.filter(each => each.type === 'date' || each.type === 'datetime')
        return data.map(each => {
            return dateColumns.reduce((accum, e) => {
                const { field } = e
                console.log('date', parseDate(accum[field], 'E MMM dd yyyy'))
                accum[field] = parseDate(accum[field])
                return accum
            }, each)
        })
    }

    const [gridProps, setGridProps] = useState(() => {
        let cols = []
        let datas = []
        const { columns, data, ...otherProps } = props
        if (props) {

            cols = columns || cols
            datas = data || datas
        }
        return {
            ...otherProps,
            columns: cols,
            data: formatDateValues(datas, cols)
        }
    })
    const { columns, data, ...otherProps } = gridProps

    const [groupable, setGroupable] = useState(() => {
        const { grouping, aggregates } = otherProps
        if (grouping && aggregates) return { footer: 'visible' }
        else return true
    })

    const aggregatesCol = useRef({})

    const [aggregates, setAggregates] = useState(() => {
        const { aggregates } = otherProps
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

    useEffect(() => {
        // fetchData(state.dataState)
    }, [])



    const fetchData = (dataState) => {
        const queryStr = `${toDataSourceRequestString(dataState)}`; // Serialize the state.
        const hasGroups = dataState.group && dataState.group.length;

        const base_url = 'http://localhost:59322/api/Values';
        const init = { method: 'GET', accept: 'application/json', headers: {} };

        fetch(`${base_url}?${queryStr}`, init)
            .then(response => response.json())
            .then(({ Data, Total, ...rest }) => {
                const data = Data
                const total = Total
                const { columns } = rest
                const cols = gridProps.columns.length > 0 ? gridProps.columns : (columns && columns.length > 0 ? columns :
                    Object.keys(data[0]).map(each => {
                        return {
                            field: each,
                            title: each
                        }
                    }))

                setGridProps({ ...rest, data: data, columns: cols })

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

    const DateTimeFilterCell = (configs) => {
        console.log('date time configs', configs)
        return <span>
            <DateTimePicker
                value={new Date()}
            />
        </span>
    }

    // const minGridWidth = 300;
    // const ADJUST_PADDING = 4;
    // const COLUMN_MIN = 4;
    // const [gridWidth, setGridWidth] = useState({
    //     setMinWidth: false,
    //     gridCurrent: 0
    // })

    // const grid = useRef('')

    // const handleResize = () => {
    //     if (grid.current.offsetWidth < minGridWidth && !gridWidth.setMinWidth) {
    //         setGridWidth({
    //             setMinWidth: true
    //         });
    //     } else if (grid.current.offsetWidth > minGridWidth) {
    //         setGridWidth({
    //             gridCurrent: grid.current.offsetWidth,
    //             setMinWidth: false
    //         });
    //     }
    // }

    // useDeepCompareEffect(() => {
    //     if (columns.length > 0) {
    //         grid.current = document.querySelector('.k-grid');
    //         window.addEventListener('resize', handleResize);
    //         setGridWidth({
    //             gridCurrent: grid.current.offsetWidth,
    //             setMinWidth: grid.current.offsetWidth < minGridWidth
    //         });
    //     }
    // }, [columns])

    // const setWidth = (minWidth) => {
    //     let width = gridWidth.setMinWidth ? minWidth :
    //         minWidth + (gridWidth.gridCurrent - minGridWidth) / columns.length;
    //     // if (width < COLUMN_MIN) width = width
    //     // else width -= ADJUST_PADDING;
    //     return width;
    // }

    const filterChange = (event) => {
        setState({
            ...state,
            result: filterBy(state.result, event.filter),
            filter: event.filter
        });
    }

    console.log('grid state', state)
    if (columns.length > 0) return (
        <ReactResizeDetector handleWidth handleHeight>
            {({ width, height }) =>
                <ExcelExport
                    data={state.result.data}
                    ref={exporter => exportExcelRef.current = exporter}
                >
                    <Grid
                        style={{ height: 700 }}
                        data={state.result}
                        {...state.dataState}
                        total={state.total}
                        onDataStateChange={dataStateChange}
                        sortable={true}
                        pageable={true}
                        pageSize={8}
                        groupable={groupable}
                        onExpandChange={expandChange}
                        expandField="expanded"
                        cellRender={cellRender}
                        //filterable={true}
                        //onFilterChange={filterChange}
                        //filter={state.filter}
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
                            let dateFormat = "{0:G}"
                            if (type === 'datetime') dateFormat = "{0:G}"
                            if (type === 'checkbox') return <Column {...otherProps} field={field} title={title} key={field} columnMenu={ColumnMenuCheckboxFilter} footerCell={footerCell} />
                            else if (type === 'date' || type === 'datetime') return <Column filterCell={DateTimeFilterCell} {...otherProps} field={field} title={title} key={field}  footerCell={footerCell} />
                            else return <Column {...otherProps} field={field} title={title} filter={type} key={field} columnMenu={ColumnMenu} footerCell={footerCell} />
                        })}
                    </Grid>
                </ExcelExport>
            }
        </ReactResizeDetector>
    )

    else return null
}
export default App;
