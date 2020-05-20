

import React from 'react';
import Embed from '../grid';
import { defaults } from '../embed';

const columns = [{ field: 'PermitNumber', title: 'Permit Number' },
{ field: 'Type', title: 'Type' },
{ field: 'Company', title: 'Company Name' },
{ field: 'DOTNumber', title: 'DOT Number' },
{ field: 'Contact', title: 'Contact' }]

export default function ReportsView() {
    const settings = { ...defaults, columns }
    return (
        <div className="m-2">
                <Embed url={`http://localhost:50147/api/Reports/Permit`} {...settings}  />
        </div>
    )
}