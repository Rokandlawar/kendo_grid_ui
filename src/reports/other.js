import React, { useState } from 'react';
import Embed from '../grid';
import { defaults } from '../embed';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'

const allColumns = {

    'Application': {
        columns: [{ field: 'ApplicationNumber', title: 'Application Number' },
        { field: 'Type', title: 'Type' },
        { field: 'Company', title: 'Company Name' },
        { field: 'Phone', title: 'Phone' },
        { field: 'Email', title: 'Email' },
        ]
    },

    'Company': {
        columns: [{ field: 'Name', title: 'Company Name' },
        { field: 'DOTNumber', title: 'DOT Number' },
        { field: 'Phone', title: 'Phone' },
        { field: 'Email', title: 'Activity Code' },
        { field: 'VendorCode', title: 'VendorCode' }]
    },


    'Ageing': {
        columns: [{ field: 'Name', title: 'Company Name' },
        { field: 'Email', title: 'Company Email' },
        { field: 'VendorCode', title: 'Vendor Code' },
        { field: 'InvoiceNumber', title: 'Invoice Number' },
        { field: 'InvoiceDate', title: 'Invoice Date', type: 'datetime' }]
    },

    'Invoice': {
        columns: [{ field: 'InvoiceNumber', title: 'Invoice Number' },
        { field: 'Name', title: 'Name' },
        { field: 'CompanyName', title: 'Company Name' },
        { field: 'DOTNumber', title: 'DOT Number' },
        { field: 'Status', title: 'Status' }]
    },

    'Permit': {
        columns: [{ field: 'PermitNumber', title: 'Permit Number' },
        { field: 'Type', title: 'Type' },
        { field: 'Company', title: 'Company Name' },
        { field: 'DOTNumber', title: 'DOT Number' },
        { field: 'Contact', title: 'Contact' }]
    },

    'SkuActivity': {
        columns: [{ field: 'PaidDate', title: 'Payment Date', type: 'datetime' },
        { field: 'FunctionCode', title: 'Function Code' },
        { field: 'RevenueCode', title: 'Revenue Code' },
        { field: 'ActivityCode', title: 'Activity Code' },
        { field: 'ActivityName', title: 'Activity Name' },
        { field: 'DOTNumber', title: 'DOT Number' },
        { field: 'CompanyName', title: 'Company Name' },
        { field: 'CompanyCode', title: 'Company Code' },
        { field: 'BillingCycles', title: 'Billing Cycles' },
        { field: 'CameraEvent', title: 'Camera Event' },
        { field: 'ConfirmationNumber', title: 'Confirmation Number' },
        { field: 'InvoiceCycle', title: 'Invoice Cycle' },
        { field: 'InvoiceNumber', title: 'Invoice Number' },
        { field: 'Charge', title: 'Charge' },
        ]
    }
}

const opts = [
    {
        value: "Company",
        label: "Companies"
    },
    {
        value: "Application",
        label: "Applications"
    },
    {
        value: "Invoice",
        label: "Invoices"
    },
    {
        value: "Ageing",
        label: "Ageing Report"
    },
    {
        value: "Permit",
        label: "Permits"
    },
    // {
    //     value: "Notify",
    //     label: "Notifications"
    // },
    {
        value: "SkuActivity",
        label: "Sku Activity List"
    }
]

export default function ReportsView() {
    const [select, setSelect] = useState(null);
    const [settings, setSettings] = useState({ ...defaults })

    return (
        <div className="m-2">
            <FormControl className="col-sm-6">
                <InputLabel >Please Select Report Type</InputLabel>
                <Select
                    value={select}
                    onChange={(e) => {
                        setSelect(e.target.value)
                        setSettings({ ...defaults, columns: allColumns[e.target.value].columns })
                    }}
                >
                    {opts.map(options => {
                        return <MenuItem value={options.value}>{options.label}</MenuItem>
                    })}
                </Select>
            </FormControl>

            {select && <Embed url={`http://localhost:50147/api/Reports/${select}`}  {...settings} />}
        </div>
    )
}