import Grid from './grid'
import React, { useEffect, useState } from 'react';

const defaults = {
    dataSource: {
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        serverGrouping: true,
        serverAggregates: true,
    },
    selectable: 'single row',
    columnMenu: true,
    sortable: true,
    filterable: true,
    resizable: true,
    scrollable: true,
    reorderable: true,
    pageable: true,
    groupable: true,
    columns: [
        { field: "IsPaid", title: "Is Paid", type: 'boolean' },
        { field: "Charge", title: "Charge", type: 'amount' },
        { field: "Activity", title: "Activity", type: 'string' },
        { field: 'Activity_Time', title: 'Activity Time', type: 'datetime' }
    ],
}



export default function Embed() {

    const [configs, setConfigs] = useState(defaults)

    const { columns } = configs

    useEffect(() => {
        const handleInput = (evt) => {
            if (evt.data && evt.data.render === 'Fields') {
                try {
                    if (typeof evt.data.content === 'string' && evt.data.content !== '')
                        setConfigs({ ...configs, ...evt.data.content })
                }
                catch (ex) {
                    console.log(ex, 'JSON Failed')
                }
            }
        }
        window.parent.postMessage('Initialized', "*")
        window.addEventListener('message', handleInput)
        // setTimeout(() => {
        //     this.rendereComplete()
        // }, 1000)
    }, [configs])

    if (columns.length > 0)
        return (
            <Grid {...defaults} />
        )
    else return null
}