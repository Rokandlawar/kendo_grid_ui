import './App.css';
import * as React from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { TitleBar } from './title-bar';
import FieldGroup from './fieldGroups';
DocumentEditorContainerComponent.Inject(Toolbar);
// tslint:disable:max-line-length
export default class Default extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.hostUrl = process.env.REACT_APP_SERVICES_URL;
        this.onLoadDefault = () => {
            window.parent.postMessage('Initialized', "*")
            // this.container.documentEditor.open(JSON.stringify(defaultDocument));
            this.container.documentEditor.documentName = 'Getting Started';
            this.titleBar.updateDocumentTitle();
            this.container.documentChange = () => {
                this.titleBar.updateDocumentTitle();
                this.container.documentEditor.focusIn();
            };
        };
        this.state = {
            groups: []
        }
    }
    handleInput = (evt) => {
        if (evt.data && evt.data.render === 'Fields') {
            try {
                if (typeof evt.data.content === 'string' && evt.data.content !== '')
                    this.container.documentEditor.open(evt.data.content)
            }
            catch (ex) {
                console.log(ex, 'JSON Failed')
            }
            this.setState({ groups: evt.data.fields })
        }
    }
    componentDidMount() {
        window.addEventListener('message', this.handleInput)
        setTimeout(() => {
            this.rendereComplete()
        }, 1000)
    }
    rendereComplete() {
        this.container.serviceUrl = this.hostUrl + '/documenteditor/';
        this.container.documentEditor.pageOutline = '#E0E0E0';
        this.container.documentEditor.acceptTab = true;
        this.container.documentEditor.resize();
        this.container.documentEditor.enableWordExport = true;
        this.titleBar = new TitleBar(document.getElementById('documenteditor_titlebar'), this.container.documentEditor, true);
        this.editor = this.container.documentEditor;
        this.onLoadDefault();
    }
    insertContent = (content) => {
        if (this.container && content && content !== '') {
            var fileName = content.replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
            var fieldCode = 'MERGEFIELD ' + fileName + " \\* MERGEFORMAT ";
            this.container.documentEditor.editor.insertField(fieldCode, '«' + content + '»');
        }
    }
    render() {
        return (<div className='control-pane h-100'>
            <div className='control-section h-100'>
                <div id='documenteditor_titlebar' className="e-de-ctn-title" />
                <FieldGroup groups={this.state.groups} insertContent={this.insertContent} />
                <div id="documenteditor_container_body" className='of-auto' style={{ height: 'calc(100% - 100px' }}>
                    <DocumentEditorContainerComponent id="container" ref={(scope) => { this.container = scope; }} enableToolbar={true} locale='en-US' />
                </div>
            </div>
        </div>);
    }
}


