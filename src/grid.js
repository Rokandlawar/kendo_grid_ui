import React, { useState, useRef, useEffect } from 'react';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import ReactResizeDetector from 'react-resize-detector';
import '@progress/kendo-ui/js/kendo.aspnetmvc';
import '@progress/kendo-ui/js/kendo.datepicker';
import '@progress/kendo-ui/js/kendo.dateinput';
import '@progress/kendo-ui/js/kendo.datetimepicker';
import '@progress/kendo-ui/js/kendo.grid';
import $ from 'jquery'
import JSZip from 'jszip'

function App(props) {

    const handleChange = (e) => {
        const grid = e.sender
        const selected = grid.dataItem(grid.select());
        props.edit(selected);
    }

    const [gridProps, setGridProps] = useState(() => {
        const { columns, dataSource, edit, url, ...otherProps } = props
        return {
            toolbar: ["excel"],
            excel: {
                fileName: "Export.xlsx",
                filterable: true,
                allPages: true
            },
            dataSource: {
                ...dataSource,
                type: "webapi",
                transport: {
                    read: {
                        url: url
                    },
                },
                schema: {
                    // data: "data",
                    // total: "total",
                    // errors: "errors",
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
            change: handleChange,
            ...otherProps,
            height: $(document).height()
        }
    })



    useEffect(() => {
        window.JSZip = JSZip
    }, [])

    console.log('gridProps', gridProps)

    return (
        <div style={{ height: 'calc(100% - 100px)' }}>
            <ReactResizeDetector handleWidth handleHeight refreshMode='throttle' refreshRate={2000} >
                {({ width, height }) =>
                    <Grid id="grid" {...gridProps}
                    />
                }
            </ReactResizeDetector>
        </div>
    )
}
export default App;
