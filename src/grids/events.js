import React from 'react';
import Embed from '../embed';

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
    return (
        <div className="m-2">
                <Embed url={`http://localhost:50147/api/Reports/Events`} columns={columns}  />
        </div>
    )
}