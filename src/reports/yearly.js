import React from 'react';
import Embed from '../grid';
import { defaults } from '../embed';

const columns = [ 
    { field: 'InvoiceNumber', title: 'Invoice Number' },
    { field: 'FunctionCode', title: 'Function Code' },
    { field: 'RevenueCode', title: 'Revenue Code' },
    { field: 'ActivityCode', title: 'Activity Code' },
    { field: 'Amount', title: 'Amount Paid', type: 'number' }
]

export default function ReportsView() {
    const settings = { ...defaults, columns }
    return (
        <div className="m-2">
                <Embed url={`http://localhost:50147/api/Reports/Yearly`} {...settings}  />
        </div>
    )
}