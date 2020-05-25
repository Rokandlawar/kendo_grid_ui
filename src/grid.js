import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import ReactResizeDetector from 'react-resize-detector';
import '@progress/kendo-ui/js/kendo.aspnetmvc';
import '@progress/kendo-ui/js/kendo.datepicker';
import '@progress/kendo-ui/js/kendo.dateinput';
import '@progress/kendo-ui/js/kendo.datetimepicker';
import '@progress/kendo-ui/js/kendo.grid';

class App extends Component {
    constructor(props) {
        super(props);
        const { columns, dataSource, edit, url, ...otherProps } = props
        this.state = {
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
                    data: "data",
                    total: "total",
                    errors: "errors",
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
                            // footerTemplate: " <div>Total Sum: $#= sum #</div><div>Total Average: $#= average #</div>",
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
            change: this.handleChange,
            ...otherProps,
            height: 700

        }
    }

    componentDidMount() {
        // let dom = window.$(ReactDOM.findDOMNode(this.elem))
        // console.log('dom',dom.data('kendoGrid'))
        // this.grid = dom.data('kendoGrid')
    }


    handleChange = (e) => {
        const grid = e.sender
        console.log('grid sender', grid)
        const selected = grid.dataItem(grid.select());
        const row = JSON.stringify(selected)
        this.props.edit({ ...JSON.parse(row), id: selected.id });
    }



    verifyOpts = (opts) => {
        if (!this.props.reload) {
            let settings = localStorage.getItem('griddata');
            if (settings) {
                settings = JSON.parse(settings);
                console.log(settings)
                try {
                    if (this.props.url == settings.dataSource.transport.read.url) {
                        settings.change = opts.change;
                        return settings;
                    }
                }
                catch (Ex) {
                    console.log(Ex);
                    localStorage.removeItem('griddata');
                }
            }
        }
        return opts;
    }

    render() {
        const { state } = this
        return (
            <div style={{ height: 'calc(100% - 100px)' }}>
                <ReactResizeDetector handleWidth handleHeight>
                    {({ width, height }) =>
                        <Grid id="grid"
                            ref={e => this.elem = e}
                            {...state}
                        />
                    }
                </ReactResizeDetector>
            </div>
        )
    }



}
export default App;
