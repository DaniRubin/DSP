import React from 'react';
import TextField from '@material-ui/core/TextField';

const Vector = (props) => {
    return <div>
        <p class="runLabel">{props.paragraph}</p>
        {props.Config.map(label =>
            <TextField error={isNaN(props.newVec[label]) && props.newVec[label] !== undefined} label={label} variant="outlined" value={props.newVec[label] || ""} disabled />
        )}
    </div>
}

export default Vector;