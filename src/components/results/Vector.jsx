import React from 'react';
import TextField from '@material-ui/core/TextField';

const Vector = (props) => {
  return <div>
    <p className="runLabel">{props.paragraph}</p>
    {props.Config.map(label =>
      <TextField
        key={label}
        error={isNaN(props.newVec[label]) && props.newVec[label] !== undefined}
        label={label}
        variant="outlined"
        value={props.newVec[label] || ""}
        disabled={props.disabled}
        onChange={(event) => props.changeValue(event, label)}
      />
    )}
  </div>
}

export default Vector;