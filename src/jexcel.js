import React, { useRef, useEffect } from "react";
import jexcel from "jexcel";
import "./styles.css";
import "../node_modules/jexcel/dist/jexcel.css";


const options = {
    data: [
        ['12A12', 'PA', '2019-02-12', 'Honda', 123, 4, 12345],
        ['Civic', 'DE', '2018-07-11', 'Camry', 345, 4, 56789],
    ],
    columns: [
        {
            type: 'text',
            title: 'Vehicle Plate',
            width: 90
        },
        {
            type: 'dropdown',
            title: 'Vehicle State',
            width: 120,
            source: [
                "PA",
                "DE",
                "NY",
                "TA",
                "LA",
            ]
        },
        {
            type: 'calendar',
            title: 'Year',
            width: 120
        },
        {
            type: 'text',
            title: 'Make',
            width: 120
        },
        {
            type: 'numeric',
            title: 'VIN',
            width: 80
        },
        {
            type: 'numeric',
            title: 'Passenger Capacity',
            width: 80
        },
        {
            type: 'numeric',
            title: 'Vehicle Number',
            width: 80,
        },
    ]
};

const App = props => {
    const jexcelRef = useRef(null);

    useEffect(() => {
        jexcel(jexcelRef.current, options);
    }, [options]);


    console.log('jexcelRef----', jexcelRef)
    return (
        <div>
            <div ref={jexcelRef} />
        </div>
    );
};

export default App;
