import React from 'react';
import GridEmbed from '../embed';

const columns = [
    { field: "Name", title: "Name" },
    { field: "DOTNumber", title: "DOTNumber" },
    { field: "Phone", title: "Phone" },
    { field: "Email", title: "Email" },
    { field: "VendorCode", title: "Customer Code" },
    { field: "BillingProfile", title: "Business Profile" },
    { field: "IsTenant", title: "Lease Holder/Tenant" },
    { field: "Status", title: "Status" },
    { field: "StatusName", title: "StatusName" },
    { field: "CreatedOn", title: "CreatedOn", type: "datetime" },
    { field: "CreatedBy", title: "CreatedBy" },
]

export default function ReportsView() {
    return <GridEmbed url={'http://localhost:50147/api/Reports/Company'} columns={columns} />
}