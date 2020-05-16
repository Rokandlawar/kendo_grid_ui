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
    dataSource: {
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        serverGrouping: true,
        serverAggregates: true,
    },
    selectable: 'single row',
    columnMenu: true,
    sortable: true,
    filterable: true,
    resizable: true,
    scrollable: true,
    reorderable: true,
    pageable: true,
    groupable: true,
    columns: [
        { field: "IsPaid", title: "Is Paid", type: 'boolean' },
        { field: "Charge", title: "Charge", type: 'amount' },
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
        const { columns, dataSource, ...otherProps } = gridProps

        setGridProps({
            toolbar: ["excel"],
            excel: {
                fileName: "Kendo UI Grid Export.xlsx",
                proxyURL: 'http://localhost:59322/api/Values',
                filterable: true
            },
            dataSource: {
                ...dataSource,
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
                                type: type === 'datetime' ? 'date' : (type === 'amount' ? 'number' : (type || 'string'))
                            }
                            return accum
                        }, {})
                    }

                },
                aggregate: columns.reduce((accum, each) => {
                    const { type, field } = each
                    if (type === 'amount') {
                        accum = accum.concat([
                            { field: field, aggregate: "sum" },
                            { field: field, aggregate: "average" }
                        ])
                    }
                    return accum
                }, []),
            },
            columns: columns.map(each => {
                const { field, title, aggregates, type } = each
                let colProps = {
                    width: '200px',
                    field: field,
                    title: title,
                }
                switch (type) {
                    case 'date':
                        colProps.format = "{0:MM/dd/yyyy}"
                        colProps.filterable = {
                            ui: 'datepicker'
                        }
                        break;
                    case 'datetime':
                        colProps.format = "{0:MM/dd/yyyy hh:mm tt}"
                        colProps.filterable = {
                            ui: 'datetimepicker'
                        }
                        break;
                    case 'amount':
                        colProps = {
                            ...colProps,
                            format: "{0:c}",
                            aggregates: ["sum", "average"],
                            footerTemplate: " <div>Total Sum: $#= sum #</div><div>Total Average: $#= average #</div>",
                            groupFooterTemplate: " <div>Sum: $#= sum #</div><div>Average: $#= average #</div>"
                        }
                        break;
                    default:
                        colProps = {
                            ...colProps
                        }
                }
                return colProps
            }),
            ...otherProps,
            height: $(document).height() - 120
        })
    }, [])

    const { columns } = gridProps

    console.log('gridProps', gridProps)
    if (columns.length > 0) return (
        <div style={{ height: 'calc(100% - 100px)' }}>
            <ReactResizeDetector handleWidth handleHeight>
                {({ width, height }) =>
                    <Grid {...gridProps}
                    />
                }
            </ReactResizeDetector>
        </div>
    )

    else return null
}
export default App;
