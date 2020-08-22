import React from 'react';

import Config from '../config.json';

const Options = props => {
  return <div class="btn-group" style={{ width: "25%" }}>
    {Config.functions.map(option => {
      let classes = "";
      if (Config.functions.indexOf(option) === 0) classes += " firstButton";
      if (Config.functions.indexOf(option) === Config.functions.length - 1) classes += " lastButton";
      if (props.choosenOption === option) classes += " btn-pressed";
      return <button
        style={{ width: (100 / Config.functions.length) + '%' }}
        onClick={() => props.convertTo(option)}
        className={classes}>
        {option}
      </button>
    })
    }
  </div>
}

export default Options;