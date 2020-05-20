import React, { useState, useRef, useEffect } from 'react';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import ReactResizeDetector from 'react-resize-detector';
import '@progress/kendo-ui/js/kendo.aspnetmvc';
import '@progress/kendo-ui/js/kendo.datepicker';
import '@progress/kendo-ui/js/kendo.dateinput';
import '@progress/kendo-ui/js/kendo.datetimepicker';
import '@progress/kendo-ui/js/kendo.grid';
import $ from 'jquery'


function App(props) {

    const minGridWidth = 700
    const gridRef = useRef(null)

    const [size, setSize] = useState({
        setMinWidth: false,
        gridCurrent: 0
    })
    const setWidth = (minWidth, numOfCols) => {
        let width = minWidth
        if (gridRef.current) {
            width = size.setMinWidth ? minWidth :
                minWidth + (size.gridCurrent - minGridWidth) / numOfCols;
        }
        return width;
    }

    const handleResize = () => {
        if (gridRef.current.offsetWidth < minGridWidth && !size.setMinWidth) {
            setSize({
                setMinWidth: true
            });
        } else if (gridRef.current.offsetWidth > minGridWidth) {
            setSize({
                gridCurrent: gridRef.current.offsetWidth,
                setMinWidth: false
            });
        }
    }

    const handleChange = (e) => {
        const grid = e.sender
        const selected = grid.dataItem(grid.select());
        props.edit(selected);
    }

    const [gridProps, setGridProps] = useState(() => {
        const { columns, dataSource, edit, url, ...otherProps } = props
        const numOfCols = columns.length
        const minColWidth = minGridWidth / numOfCols
        return {
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
                        url: url
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
                    width: setWidth(minColWidth, numOfCols),
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
        gridRef.current = document.querySelector('.k-grid');
        window.addEventListener('resize', handleResize);
        setSize({
            gridCurrent: gridRef.current.offsetWidth,
            setMinWidth: gridRef.current.offsetWidth < minGridWidth
        });

    }, [])


    

    console.log('gridProps', gridProps)

    return (
        <div style={{ height: 'calc(100% - 100px)' }}>
            <ReactResizeDetector handleWidth handleHeight>
                {({ width, height }) =>
                    <Grid id="grid" {...gridProps} ref={(e) => gridRef.current = e}
                    />
                }
            </ReactResizeDetector>
        </div>
    )
}
export default App;
