import React from 'react';

const Button = props => {
    return <button id="convertButton" onClick={props.convertFunc}>
        Convert!
    </button>
}
export default Button;