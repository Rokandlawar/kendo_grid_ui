import Grid from './grid'
import React, { useEffect, useState } from 'react';

export const defaults = {
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
    columns: [],
}



export default function Embed(props) {

    const [configs, setConfigs] = useState(() => {
        if (props) return { ...defaults, ...props }
        else return defaults
    })

    const { columns } = configs



    useEffect(() => {
        const handleInput = (evt) => {
            console.log('event', evt)
            if (evt.data && evt.data.columns) {
                try {
                    setConfigs({ ...configs, columns: evt.data.columns, url: evt.data.url })
                }
                catch (ex) {
                    console.log(ex, 'JSON Failed')
                }
            }
        }
        window.parent.postMessage('Initialized', "*")
        window.addEventListener('message', handleInput)
    }, [])

    console.log('embed', configs)
    if (columns.length > 0)
        return (
            <Grid {...configs} />
        )
    else return null
}