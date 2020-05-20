import React from 'react';
import Embed from '../grid';
import { defaults } from '../embed';

const columns = [ 
    { field: 'Id', title: 'Event Id' },
    { field: 'Plate_Number', title: 'License Plate / Tail Number' },
    { field: 'Plate_Region', title: 'Region' },
    { field: 'DOTNumber', title: 'DOT' },
    { field: 'Company', title: 'Company Name' },
    { field: 'Camera', title: 'Camera Name' },
    { field: 'Activity_Time', title: 'Activity Date',type:"datetime" },
    { field: 'Status', title: 'Status' },
]

export default function ReportsView() {
    const settings = { ...defaults, columns }
    return (
        <div className="m-2">
                <Embed url={`http://localhost:50147/api/Reports/Events`} {...settings}  />
        </div>
    )
}