
exports.readFile = async (e, changeTLEcontent) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const text = (e.target.result)
    changeTLEcontent(text);
  };
  reader.readAsText(e.target.files[0])
}
exports.makeTLEexplain = (tle) => {
  const answer = getDATAandSplit(tle);
  const tleObject = {};
  tleObject.firstLine = splitFirstLine(answer.firstLine);
  tleObject.secondLine = splitSecondLine(answer.secondLine);
  console.log(tleObject)
  return tleObject;
}

exports.convertFuncCartesian = () => {

}
exports.convertFuncKepler = () => {

}
exports.convertSGP4 = () => {

}
exports.returnFunctionByOption = (choosenOption) => {
  if (choosenOption === "TLE") return this.makeTLEexplain;
  if (choosenOption === "Cartesian") return this.convertFuncCartesian;
  if (choosenOption === "Keplarian") return this.convertFuncKepler
  if (choosenOption === "SGP4") return this.convertSGP4;
}




function splitSecondLine(secondLine) {
  const splited = {};
  splited["Line number"] = secondLine.split(" ")[0];
  splited["Satellite catalog number"] = secondLine.slice(2, 7);
  splited["Inclination (degrees)"] = secondLine.slice(8, 16);
  splited["Ascending Node (degrees - omega)"] = secondLine.slice(17, 25);
  splited["Eccentricity (e)"] = secondLine.slice(26, 33);
  splited["Argument of Perigee (small omega)"] = secondLine.slice(34, 42);
  splited["Mean Anomaly (degrees)"] = secondLine.slice(43, 51);
  splited["Mean Motion (revolutions per day)"] = secondLine.slice(52, 63);
  splited["Revolution number (revolutions)"] = secondLine.slice(63, 68);
  splited["Checksum"] = secondLine.slice(68, 69);
  return splited;
}
function splitFirstLine(firstLine) {
  const splited = {};
  splited["Line number"] = firstLine.split(" ")[0];
  splited["Satellite catalog number"] = firstLine.slice(2, 7);
  splited["Classification"] = firstLine.slice(7, 8);
  splited["last two digits of lunch year"] = firstLine.slice(9, 11);
  splited["launch number of the year"] = firstLine.slice(11, 14);
  splited["piece of the launch"] = firstLine.slice(14, 17);
  splited["last two digits of Epoch year"] = firstLine.slice(18, 20);
  splited["day of the year Epoch"] = firstLine.slice(20, 32);
  splited["First Derivative of Mean Motion"] = firstLine.slice(33, 43);
  splited["Second Derivative of Mean Motion"] = firstLine.slice(44, 52);
  splited["Drag Term"] = firstLine.slice(53, 61);
  splited["Ephemeris type"] = firstLine.slice(62, 63);
  splited["Element set number"] = firstLine.slice(64, 68);
  splited["Checksum"] = firstLine.slice(68, 69);
  return splited
}

function getDATAandSplit(data) {
  const results = {};
  if (data === "") {
    alert("Didnt found TLE file");
    return false;
  } else {
    if (data.split("\n")[0].length > 50) {
      results.firstLine = data.split("\n")[0];
      results.secondLine = data.split("\n")[1];
    } else {
      results.firstLine = data.split("\n")[1];
      results.secondLine = data.split("\n")[2];
    }
    return results;
  }
}