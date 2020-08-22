
const makeTLEexplain = (tle) => {
  const answer = getDATAandSplit(tle);
  const tleObject = {};
  tleObject.firstLine = splitFirstLine(answer.firstLine);
  tleObject.secondLine = splitSecondLine(answer.secondLine);
  console.log(tleObject)
  return tleObject;
}

const convertFuncKepler = (tle, Config) => {
  const answer = getDATAandSplit(tle);
  const keplerObject = {};
  const meanMotion = parseFloat(answer.secondLine.slice(52, 63));
  const meanAnomaly = parseFloat(answer.secondLine.slice(43, 51));
  const meanMotionRadian = (Math.PI * 2 * meanMotion) / 86400;
  const semiMajorAxis = Math.pow(Config.gravitaionalConstentEarth / Math.pow(meanMotionRadian, 2), 1 / 3).toFixed(3);
  const Eccentricity = parseFloat("0." + answer.secondLine.slice(26, 33));
  keplerObject["A - Semi major axis"] = semiMajorAxis;
  keplerObject["E - Eccentricity"] = Eccentricity;
  keplerObject["I - Inclination"] = parseFloat(answer.secondLine.slice(8, 16));
  keplerObject["Ω - Angle to ascending node	"] = parseFloat(answer.secondLine.slice(17, 25));
  keplerObject["ω - Argument of Perigee	"] = parseFloat(answer.secondLine.slice(34, 42));
  keplerObject["ν - True anomaly"] = getTrueAnamoly(Eccentricity, meanAnomaly, 14);
  console.log(keplerObject);
  return keplerObject;
}

const convertFuncCartesian = () => {

}
const convertSGP4 = () => {

}
exports.returnFunctionByOption = (choosenOption) => {
  if (choosenOption === "TLE") return makeTLEexplain;
  if (choosenOption === "Cartesian") return convertFuncCartesian;
  if (choosenOption === "Keplarian") return convertFuncKepler
  if (choosenOption === "SGP4") return convertSGP4;
}
exports.readFile = async (e, changeTLEcontent) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const text = (e.target.result)
    changeTLEcontent(text);
  };
  reader.readAsText(e.target.files[0])
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
function degreeToRadians(degree) {
  return degree / 57.2958;
}
function radianToDegree(radian) {
  return radian * 57.2958;
}

function getTrueAnamoly(Eccentricity, meanAnomaly, dp) {
  let i = 0;
  let maxIter = 30;
  let delta = Math.pow(10, -dp);
  meanAnomaly = meanAnomaly % 360;
  meanAnomaly = (meanAnomaly * 2.0 * Math.PI) / 360.0;
  let eccentricAnomaly = Eccentricity < 0.8 ? meanAnomaly : Math.PI;
  let F = eccentricAnomaly - Eccentricity * Math.sin(meanAnomaly) - meanAnomaly;
  while (Math.abs(F) > delta && i < maxIter) {
    eccentricAnomaly =
      eccentricAnomaly - F / (1.0 - Eccentricity * Math.cos(eccentricAnomaly));
    F = eccentricAnomaly - Eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly;
    i = i + 1;
  }
  const eccentricAnomalyDegree = ((eccentricAnomaly * 180.0) / Math.PI).toFixed(dp);
  const sin = Math.sin(eccentricAnomaly);
  const cos = Math.cos(eccentricAnomaly);
  const fak = Math.sqrt(1.0 - Math.pow(Eccentricity, 2));
  const phi = ((Math.atan2(fak * sin, cos - Eccentricity) * 180.0) / Math.PI).toFixed(
    4
  );
  return phi;
}
