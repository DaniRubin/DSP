import React, { useState } from 'react';

import Options from './Options'
import Basic from './Basic.jsx';
import SGP4 from './SGP4.jsx';

const Main = props => {
  const [choosenOption, changeChoosenOption] = useState("SGP4");
  const [showObject, toggleShowObject] = useState(false);

  const handleChooseOption = (option) => {
    changeChoosenOption(option);
    toggleShowObject(false);
  }
  return <div>
    <Options convertTo={handleChooseOption} choosenOption={choosenOption} />
    {choosenOption !== "SGP4" && <Basic choosenOption={choosenOption} showObject={showObject} toggleShowObject={toggleShowObject} />}
    {choosenOption === "SGP4" && <SGP4 />}

  </div>
}

export default Main;