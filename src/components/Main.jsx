import React, { useState } from 'react';

import Options from './Options'
import Button from './Button'
import { readFile, makeTLEexplain, convertFuncCartesian, convertFuncKepler, convertSGP4, returnFunctionByOption } from './main.js';


const Main = props => {
  // const [choosenFunction, changeChoosenFunction] = useState(null);
  const [choosenOption, changeChoosenOption] = useState(null);
  const [tleContent, changeTLEcontent] = useState(
    "1 44236C 19029B   20071.51904094  .00005323  00000-0  78478-4 0   714\n2 44236  53.0049 284.5500 0007211 319.6814 226.3936 15.54732759    19"
  );

  const convertFunc = () => {
    if (choosenOption == null) alert("יש לבחור פונקציונליות");
    else returnFunctionByOption(choosenOption)();
  }
  // alert(choosenFunction)
  return <div>
    <Options convertTo={changeChoosenOption} choosenOption={choosenOption} />
    <textarea id="textTLE" rows="4" placeholder="insert your TLE here" value={tleContent} />
    <input class="uploadTLE" type="file" name="file" accept=".txt" onChange={(e) => readFile(e, changeTLEcontent)} />
    <Button convertFunc={convertFunc} />
  </div>
}

export default Main;