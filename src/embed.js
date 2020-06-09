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
    selectable: true,
    columnMenu: true,
    sortable: true,
    filterable: true,
    resizable: true,
    scrollable: true,
    reorderable: true,
    pageable: true,
    groupable: true,
    columns: [],
    pageable: {
        refresh: true,
        buttonCount: 5,
        pageSizes: [20, 40, 100, 200],
    }
}



export default function Embed(props) {

    const [configs, setConfigs] = useState(() => {
        console.log('props', props)
        if (props) return { ...defaults, ...props }
        else return defaults
    })

    const { columns } = configs
    const handleInput = (evt) => {
        console.log('event', evt)
        if (evt.data) {
            const { columns, url, param, sort } = evt.data
            if (columns && url && param) {
                try {
                    setConfigs({ ...configs, columns: columns, url: url, param, sort })
                }
                catch (ex) {
                    console.log(ex, 'JSON Failed')
                }
            }
        }
    }

    const onSelection = (row) => {
        console.log('selected', row)
        if (row) {
            window.parent.postMessage(row, "*")
        }
    }

    useEffect(() => {
        window.parent.postMessage('Initialized', "*")
        window.addEventListener('message', handleInput)
    }, [])

    if (columns.length > 0)
        return (
            <Grid {...configs} edit={onSelection} />
        )
    else return null
}