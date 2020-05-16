import React, { useState, useRef, useEffect } from 'react';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import ReactResizeDetector from 'react-resize-detector';
import '@progress/kendo-ui/js/kendo.aspnetmvc';
import '@progress/kendo-ui/js/kendo.datepicker';
import '@progress/kendo-ui/js/kendo.dateinput';
import '@progress/kendo-ui/js/kendo.datetimepicker';
import '@progress/kendo-ui/js/kendo.grid';
import $ from 'jquery'


const defaults = {
    dataSource: {},
    sortable: true,
    pageable: true,
    scrollable: true,
    columns: [
        { field: "IsPaid", title: "Is Paid", type: 'boolean' },
        { field: "Charge", title: "Charge", type: 'number', aggregates: true },
        {
            field: "Activity", title: "Activity", type: 'string'
        },
        {
            field: 'Activity_Time', title: 'Activity Time', type: 'datetime',
        }
    ],
}


function App(props) {

    const [gridProps, setGridProps] = useState(defaults)

    useEffect(() => {

        const columns = defaults.columns

        setGridProps({
            dataSource: {
                type: "webapi",
                transport: {
                    read: {
                        url: 'http://localhost:59322/api/Values'
                    },
                },
                schema: {
                    data: "Data",
                    total: "Total",
                    errors: "Errors",
                    model: {
                        fields: columns.reduce((accum, each) => {
                            const { field, type } = each
                            accum[field] = {
                                field: field,
                                type: type === 'datetime' ? 'date' : (type || 'string')
                            }
                            return accum
                        }, {})
                    }

                },
                aggregate: columns.reduce((accum, each) => {
                    const { aggregates, field } = each
                    if (aggregates) {
                        accum = accum.concat([
                            { field: field, aggregate: "sum" },
                            { field: field, aggregate: "average" }
                        ])
                    }
                    return accum
                }, []),
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                serverGrouping: true,
                //serverAggregates: true,
            },
            columns: columns.map(each => {
                const { field, title, aggregates, type } = each
                let colProps = { width: '200px' }
                switch (type) {
                    case 'date':
                        colProps.format = "{0:MM/dd/yyyy}"
                        colProps.filterable = {
                            ui: 'datepicker'
                        }
                        break;
                    case 'datetime':
                        colProps.format = "{0:MM/dd/yyyy HH:mm:ss}"
                        colProps.filterable = {
                            ui: 'datetimepicker'
                        }
                        break;
                    default:
                        colProps.filterable = true

                }
                if (aggregates) colProps = {
                    ...colProps,
                    field: field,
                    title: title,
                    aggregates: ["sum", "average"],
                    footerTemplate: " <div>Total Sum: #= sum #</div><div>Total Average: #= average #</div>",
                    groupFooterTemplate: " <div>Sum: #= sum #</div><div>Average: #= average #</div>"
                }

                else colProps = {
                    ...colProps,
                    field: field,
                    title: title,
                }
                return colProps
            }),
            selectable: 'single row',
            columnMenu: true,
            sortable: true,
            filterable: true,
            resizable: true,
            scrollable: true,
            reorderable: true,
            pageable: true,
            groupable: true,
            height: $(document).height() - 120
        })
    }, [])

    const saveToExcel = () => {
        if (gridRef.current)
            gridRef.current.saveAsExcel();
    }

    const gridRef = useRef(null)
    const { columns } = gridProps

    console.log('gridProps', gridProps)
    if (columns.length > 0) return (
        <div style={{ height: 'calc(100% - 100px)' }}>
            <ReactResizeDetector handleWidth handleHeight>
                {({ width, height }) =>
                    <Grid ref={e => gridRef.current = e} width={width} {...gridProps}
                    />
                }
            </ReactResizeDetector>
        </div>
    )

    else return null
}
export default App;
