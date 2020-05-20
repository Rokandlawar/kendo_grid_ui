import React from 'react';
import GridEmbed from '../embed';

const columns = [
    { field: 'InvoiceNumber', title: 'Invoice Number' },
    { field: 'Name', title: 'Name' },
    { field: 'CompanyName', title: 'Company Name' },
    { field: 'DOTNumber', title: 'DOT Number' },
    { field: 'FiscalYear', title: 'Fiscal Year' },
    { field: 'Status', title: 'Status' },
    { field: 'InvoiceDate', title: 'Invoice Date', type: "date-time" },
    { field: 'DueDate', title: 'Due Date', type: "date-time" },
    { field: 'FinalizeDue', title: 'Finalize Due', type: "date-time" },
    { field: "CreatedOn", title: "CreatedOn", type: "datetime" },
    { field: "CreatedBy", title: "CreatedBy" },
    { field: 'AmountDue', title: 'Amount Due', type: 'number' },
    { field: 'Total', title: 'Mutlipier', type: 'number' }
]

export default function ReportsView() {
    return <GridEmbed url={'http://localhost:50147/api/Reports/Invoice'} columns={columns} />
}