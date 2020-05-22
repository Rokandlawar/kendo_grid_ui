

import React from 'react';
import Embed from '../embed';

const columns = [{ field: 'PermitNumber', title: 'Permit Number' },
{ field: 'Name', title: 'Type' },
{ field: 'Company', title: 'Company Name' },
{ field: 'DOTNumber', title: 'DOT Number' },
{ field: 'CreatedBy', title: 'Contact' }]

export default function ReportsView() {
    return (
        <div className="m-2">
            <Embed url={`http://localhost:50147/api/Reports/Permit`} columns={columns} />
        </div>
    )
}