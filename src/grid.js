import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid } from '@progress/kendo-grid-react-wrapper';
import ReactResizeDetector from 'react-resize-detector';
import '@progress/kendo-ui/js/kendo.aspnetmvc';
import '@progress/kendo-ui/js/kendo.datepicker';
import '@progress/kendo-ui/js/kendo.dateinput';
import '@progress/kendo-ui/js/kendo.datetimepicker';
import '@progress/kendo-ui/js/kendo.grid';
import clone from 'lodash/clone';

class App extends Component {
    constructor(props) {
        super(props);
        const { columns, dataSource, edit, url, sort, ...otherProps } = props
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
                sort: { field: sort || 'id', dir: 'desc' },
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
            height: $(document).height() - 25

        }

    }

    componentDidMount() {
        let dom = $(ReactDOM.findDOMNode(this.elem))
        console.log('dom', dom.data('kendoGrid'))
        this.grid = dom.data('kendoGrid')
    }

    saveGrid = () => {
        if (this.grid) {
            let settings = this.grid.getOptions();
            localStorage.setItem('griddata', kendo.stringify(settings));
        }
    }

    componentWillUnmount() {
        if (this.grid) {
            let settings = this.grid.getOptions();
            localStorage.setItem('griddata', kendo.stringify(settings));
        }
        delete this.grid
    }

    handleChange = (e) => {
        this.saveGrid();
        if (this.props.param) {
            const selected = this.grid.dataItem(this.grid.select());
            const row = selected[this.props.param];
            this.props.edit(row);
        }
    }

    verifyOpts = (opts) => {
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
        return opts;
    }

    render() {
        const { state } = this
        const opts = this.verifyOpts(state);
        return (
            <div style={{ height: 'calc(100% - 100px)' }}>
                <ReactResizeDetector handleWidth handleHeight refreshMode='throttle' refreshRate={2000}>
                    {
                        (width, height) => {
                            return <Grid id="grid"
                                ref={e => this.elem = e}
                                {...opts}
                            />
                        }
                    }
                </ReactResizeDetector>

            </div>
        )
    }

}
export default App;
