import React, { useEffect, useState } from 'react';
import Embed from '../grid';
import { defaults } from '../embed';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'

const columns = [
    { field: 'ChargeDescription', title: 'Company Name' },
    { field: 'ChargeDescription', title: 'Sku Name' },
    { field: 'FunctionCode', title: 'Function Code' },
    { field: 'RevenueCode', title: 'Revenue Code' },
    { field: 'Amount', title: 'Amount Paid', type: 'number' }
]

export default function ReportsView() {
    const [skus, setSkus] = useState([])
    const [select, setSelect] = useState(null);
    const settings = { ...defaults, columns }
    useEffect(() => {
        fetch('http://localhost:50147/api/Reports/SkuAll')
            .then(response => response.json())
            .then(data => setSkus(data.Data.map(i => { return { label: i.Name, value: i.Id } })));
    }, [])


    return <div className="m-1">
        <FormControl className="col-sm-6">
            <InputLabel >Please Select Report Type</InputLabel>
            <Select
                value={select}
                onChange={(e) => {
                    setSelect(e.target.value)
                }}
            >
                {skus && skus.length > 0 && skus.map(options => {
                    return <MenuItem value={options.value}>{options.label}</MenuItem>
                })}
            </Select>
        </FormControl>
        {select && <Embed url={`http://localhost:50147/api/Reports/Sku/${select}`}{...settings} />}
    </div>
}

