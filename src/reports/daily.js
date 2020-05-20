import React, {  useState } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs'
import moment from 'moment';
import Embed from '../grid';
import {defaults} from '../embed';

const columns = [
    {
        field: 'PaymentDate', title: 'Payment Date', type: "datetime"
    },
    { field: 'sku', title: 'Sku Details' },
    { field: 'InvoiceNumber', title: 'Invoice Number' },
    { field: 'FunctionCode', title: 'Function Code' },
    { field: 'RevenueCode', title: 'Revenue Code' },
    { field: 'Amount', title: 'Amount Paid', type: 'number' }
]

export default function ReportsView() {
    const [date, setDate] = useState(null);
    const [selectdate, setSelecDate] = useState(null);


    const dateChange = (e) => {
        console.log("here 1")
        setSelecDate(new Date(e.target.value));
        setDate(moment(e.target.value).format('YYYY-MM-DD'))
    }

    //re render 2 times
    return (
        <div className="m-2">
            <DatePicker
                value={selectdate}
                onChange={dateChange}
            />

            {date && <Embed url={`http://localhost:50147/api/Reports/Date?dt=${date}`} columns={columns} {...defaults} />}
        </div>
    )
}