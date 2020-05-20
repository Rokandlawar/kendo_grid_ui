

import React from 'react';
import Embed from '../grid';
import { defaults } from '../embed';

const columns = [{ field: 'Id', title: 'Application Number' },
{ field: 'Name', title: 'Type' },
{ field: 'Fiscal', title: 'Fiscal Year' },
{ field: 'Company', title: 'Company Name' },
{ field: 'Phone', title: 'Phone' },
{ field: 'Email', title: 'Email' },
{ field: 'Status', title: 'Status' },
{ field: 'SubmitDate', title: 'Submitted Date', type: "date-time" },
{ field: 'RiskSent', title: 'Sent to Risk On' },
{ field: 'RiskReceived', title: 'Received from Risk On' },
{ field: 'CreatedOn', title: 'Created On', type: "date-time" },
{ field: 'ApprovedDate', title: 'Approved Date', type: "date-time" },
{ field: 'PaidDate', title: 'Paid Date', type: "date-time" },
{ field: 'AmountPaid', title: 'Amount Paid' },
{ field: 'PermitsIssued', title: 'Permits Issued', type: "number" },
{ field: 'CreatedBy', title: 'Created By' },
{ field: 'UpdatedBy', title: 'Updated By' },]

export default function ReportsView() {
    const settings = { ...defaults, columns }
    return (
        <div className="m-2">
            <Embed url={`http://localhost:50147/api/Reports/Application`} {...settings} />
        </div>
    )
}