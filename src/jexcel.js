import React, { useRef, useEffect, useState } from "react";
import jexcel from "jexcel";
import "./styles.css";
import "../node_modules/jexcel/dist/jexcel.css";
import Button from '@material-ui/core/Button';

const years = (min, max) => { let list = []; while (min <= max) { list.push({ name: min.toString(), id: min }); min++; }; console.log('years', list); return list }

const states = [{ "name": "Alabama", "id": "AL" }, { "name": "Alaska", "id": "AK" }, { "name": "American Samoa", "id": "AS" }, { "name": "Arizona", "id": "AZ" }, { "name": "Arkansas", "id": "AR" }, { "name": "California", "id": "CA" }, { "name": "Colorado", "id": "CO" }, { "name": "Connecticut", "id": "CT" }, { "name": "Delaware", "id": "DE" }, { "name": "District Of Columbia", "id": "DC" }, { "name": "Federated States Of Micronesia", "id": "FM" }, { "name": "Florida", "id": "FL" }, { "name": "Georgia", "id": "GA" }, { "name": "Guam", "id": "GU" }, { "name": "Hawaii", "id": "HI" }, { "name": "Idaho", "id": "ID" }, { "name": "Illinois", "id": "IL" }, { "name": "Indiana", "id": "IN" }, { "name": "Iowa", "id": "IA" }, { "name": "Kansas", "id": "KS" }, { "name": "Kentucky", "id": "KY" }, { "name": "Louisiana", "id": "LA" }, { "name": "Maine", "id": "ME" }, { "name": "Marshall Islands", "id": "MH" }, { "name": "Maryland", "id": "MD" }, { "name": "Massachusetts", "id": "MA" }, { "name": "Michigan", "id": "MI" }, { "name": "Minnesota", "id": "MN" }, { "name": "Mississippi", "id": "MS" }, { "name": "Missouri", "id": "MO" }, { "name": "Montana", "id": "MT" }, { "name": "Nebraska", "id": "NE" }, { "name": "Nevada", "id": "NV" }, { "name": "New Hampshire", "id": "NH" }, { "name": "New Jersey", "id": "NJ" }, { "name": "New Mexico", "id": "NM" }, { "name": "New York", "id": "NY" }, { "name": "North Carolina", "id": "NC" }, { "name": "North Dakota", "id": "ND" }, { "name": "Northern Mariana Islands", "id": "MP" }, { "name": "Ohio", "id": "OH" }, { "name": "Oklahoma", "id": "OK" }, { "name": "Oregon", "id": "OR" }, { "name": "Palau", "id": "PW" }, { "name": "Pennsylvania", "id": "PA" }, { "name": "Puerto Rico", "id": "PR" }, { "name": "Rhode Island", "id": "RI" }, { "name": "South Carolina", "id": "SC" }, { "name": "South Dakota", "id": "SD" }, { "name": "Tennessee", "id": "TN" }, { "name": "Texas", "id": "TX" }, { "name": "Utah", "id": "UT" }, { "name": "Vermont", "id": "VT" }, { "name": "Virgin Islands", "id": "VI" }, { "name": "Virginia", "id": "VA" }, { "name": "Washington", "id": "WA" }, { "name": "West Virginia", "id": "WV" }, { "name": "Wisconsin", "id": "WI" }, { "name": "Wyoming", "id": "WY" }]

const cols = ['plate', 'state', 'year', 'make', 'vin', 'pax', 'number']

const opts = {
    data: [
        ['12A12', 'PA', '2019', 'Honda', 123, 4, 12345],
        ['Civic', 'DE', '2019', 'Camry', 345, 4, 56789],
    ],
    columns: [
        {
            type: 'text',
            title: 'Vehicle Plate',
            width: 200
        },
        {
            type: 'dropdown',
            title: 'Vehicle State',
            width: 200,
            source: states
        },
        {
            type: 'dropdown',
            title: 'Year',
            width: 200,
            source: years(1930, new Date().getFullYear())
        },
        {
            type: 'text',
            title: 'Make',
            width: 200
        },
        {
            type: 'numeric',
            title: 'VIN',
            width: 200
        },
        {
            type: 'numeric',
            title: 'Passenger Capacity',
            width: 200
        },
        {
            type: 'numeric',
            title: 'Vehicle Number',
            width: 200,
        },
    ]
};

const App = props => {
    const [options, setOptions] = useState(opts)

    const jexcelRef = useRef(options);

    const handleInput = (evt) => {
        console.log('event', evt)
        if (evt.data) {
            try {
                setOptions({
                    data: evt.data.reduce((accum, each) => {
                        accum.push(
                            cols.map(e => {
                                return each[e]
                            })
                        )
                        return accum
                    }, []),
                    columns: options.columns
                })

                // setConfigs({ ...configs, columns: evt.data.columns, url: evt.data.url })
            }
            catch (ex) {
                console.log(ex, 'JSON Failed')
            }
        }
    }
    useEffect(() => {
        jexcel(jexcelRef.current, options);
        window.parent.postMessage('Initialized', "*")
        window.addEventListener('message', handleInput)
    }, [])


    useEffect(() => {
        if (jexcelRef.current.jexcel) {
            jexcelRef.current.jexcel.setData(options.data)
        }
    }, [options.data]);


    const save = () => {
        const data = jexcelRef.current.jexcel.getData()
        const config = jexcelRef.current.jexcel.getConfig()
        console.log('data', data, config)
        const modifiedData = data.map(each => {
            return each.reduce((accum, e, index) => {
                accum[cols[index]] = e
                return accum
            }, {})
        })
        console.log('modified data', modifiedData)
        window.parent.postMessage(modifiedData, "*")
    }
    console.log('jexcelRef----', jexcelRef)
    return (
        <div>
            <div ref={jexcelRef} />
            <br></br>
            <Button variant="contained" color="primary" onClick={save}>
                save
            </Button>
        </div >
    );
};

export default App;
