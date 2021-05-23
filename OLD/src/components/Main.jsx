import React, { useState } from 'react';

import Options from './Options'
import Basic from './Basic.jsx';
import SGP4 from './SGP4.jsx';
import Predict from './Predict.jsx';
import Config from '../config.json';

const Main = props => {
  const [choosenOption, changeChoosenOption] = useState(Config.defultFunction);
  const [showObject, toggleShowObject] = useState(false);

  const handleChooseOption = (option) => {
    changeChoosenOption(option);
    toggleShowObject(false);
  }
  let content;
  if (choosenOption === "SGP4") content = <SGP4 />
  else if (choosenOption === "Predict") content = <Predict />
  else content = <Basic choosenOption={choosenOption} showObject={showObject} toggleShowObject={toggleShowObject} />

  return <div>
    <Options convertTo={handleChooseOption} choosenOption={choosenOption} />
    {content}
  </div>
}

export default Main;