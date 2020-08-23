import React from 'react';
import TLEexplain from './TLEexplain';
import Keplarian from './Keplarian';
import Cartesian from './Cartesian';

const Results = props => {
    let content = "";
    if (props.choosenOption === "TLE")
        content = <TLEexplain resultData={props.resultData} exit={props.exit} />
    else if (props.choosenOption === "Keplarian")
        content = <Keplarian resultData={props.resultData} exit={props.exit} />
    else if (props.choosenOption === "Cartesian")
        content = <Cartesian resultData={props.resultData} exit={props.exit} />
    return content;
}

export default Results;