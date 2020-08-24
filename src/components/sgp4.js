// import Config from '../config.json';

exports.convertCartesianToKepler = (vector, Config, catalogNumber) => {
    // const Rvector = [6524.834, 6862.875, 6448.296];
    // const Vvector = [4.901327, 5.533756, -1.976341];
    const Rvector = [vector["Xi"], vector["Xj"], vector["Xk"]];
    const Vvector = [vector["Yi"], vector["Yj"], vector["Yk"]];
    const Hvector = vectoricalMultiple(Rvector, Vvector);
    const Nvector = vectoricalMultiple([0, 0, 1], Hvector);
    //inclination
    const inclination = radianToDegree(Math.acos((Hvector[2] / getMagnitudeOfMetrix(Hvector))));
    console.log("inclination - " + inclination);
    //semi major axis
    const tempValue = ((Math.pow(getMagnitudeOfMetrix(Vvector), 2) / 2) - (Config.gravitaionalConstentEarth / getMagnitudeOfMetrix(Rvector)));
    const semiMajorAxis = ((-Config.gravitaionalConstentEarth) / (2 * tempValue));
    console.log("semiMajorAxis - " + semiMajorAxis);
    //eccentricity
    const temp1 = multipleScalarAndVector(Rvector, (Math.pow(getMagnitudeOfMetrix(Vvector), 2) - (Config.gravitaionalConstentEarth / getMagnitudeOfMetrix(Rvector))));
    const temp2 = multipleScalarAndVector(Vvector, scalaricMultiple(Rvector, Vvector));
    const Evector = multipleScalarAndVector(vectoricalSubtraction(temp1, temp2), (1 / Config.gravitaionalConstentEarth));
    const eccentricity = getMagnitudeOfMetrix(Evector);
    console.log("eccentricity - " + eccentricity);
    //ascendingNode
    let ascendingNode = radianToDegree(Math.acos((Nvector[0] / getMagnitudeOfMetrix(Nvector))));
    if (Nvector[1] < 0) ascendingNode = 360 - ascendingNode;
    console.log("ascendingNode - " + ascendingNode);
    //argumantPerigee
    const temp3 = (scalaricMultiple(Nvector, Evector));
    const temp4 = getMagnitudeOfMetrix(Nvector) * getMagnitudeOfMetrix(Evector);
    let argumantPerigee = radianToDegree(Math.acos(temp3 / temp4));
    if (Evector[2] < 0) argumantPerigee = 360 - argumantPerigee;
    console.log("argumantPerigee - " + argumantPerigee);
    //trueAnomaly
    const temp5 = (scalaricMultiple(Evector, Rvector));
    const temp6 = getMagnitudeOfMetrix(Evector) * getMagnitudeOfMetrix(Rvector);
    let trueAnomaly = radianToDegree(Math.acos(temp5 / temp6));
    if (scalaricMultiple(Rvector, Vvector) < 0) trueAnomaly = 360 - trueAnomaly;
    if (trueAnomaly > 180) trueAnomaly = trueAnomaly - 360;
    console.log("trueAnomaly - " + trueAnomaly);

    // document.getElementById("backParams").style.display = "block";
    const TLEsecondLine = convertKeplerToTLE(semiMajorAxis, inclination, ascendingNode, argumantPerigee, eccentricity, trueAnomaly, Config, catalogNumber);
    // document.getElementById("backParams").innerHTML = TLEsecondLine;

    return TLEsecondLine;
}

function createValidAngle(angle) {
    let finalAngle = angle;
    if (finalAngle < 10) finalAngle = "   " + finalAngle;
    else if (finalAngle > 100) finalAngle = " " + finalAngle;
    else finalAngle = "  " + finalAngle;
    return finalAngle;
}

function convertKeplerToTLE(semiMajorAxis, inclination, ascendingNode, argumantPerigee, eccentricity, trueAnomaly, Config, catalogNumber) {
    if (eccentricity > 1) eccentricity = 0.0007721;
    if (semiMajorAxis < 0) semiMajorAxis = - semiMajorAxis

    let TLEsecondLine = "";


    let ecc = parseFloat(eccentricity);
    TLEsecondLine += "2 " + catalogNumber + createValidAngle(inclination.toFixed(4))
    TLEsecondLine += createValidAngle(ascendingNode.toFixed(4)) + " ";
    //make eccentricity part
    // eccentricity = eccentricity * Math.pow(10, eccentricity.toString().length - 2);
    // eccentricity = eccentricity.toString().length >= 7 ? eccentricity : new Array(7 - eccentricity.toString().length + 1).join("0") + eccentricity;
    TLEsecondLine += eccentricity.toFixed(7).toString().split('.')[1] + createValidAngle(argumantPerigee.toFixed(4));

    // alert(degreeToRadians(trueAnomaly))
    //make the mean anomaly?
    const topPart = Math.cos(degreeToRadians(trueAnomaly)) + ecc;
    const bottomPart = 1 + ecc * Math.cos(degreeToRadians(trueAnomaly));
    const eccetricAnomaly = radianToDegree(Math.acos(topPart / bottomPart));
    let meanAnomaly = eccetricAnomaly - ecc * Math.sin(degreeToRadians(eccetricAnomaly));
    // alert(meanAnomaly)
    // alert(trueAnomaly)
    if (trueAnomaly < 0) meanAnomaly = 360 - meanAnomaly;
    console.log("mean anomaly - " + trueAnomaly);

    TLEsecondLine += createValidAngle(meanAnomaly.toFixed(4)) + " ";
    //make meanMotion
    let meanMotion =
        (86400 / (2 * Math.PI)) *
        Math.sqrt((Config.gravitaionalConstentEarth) / Math.pow(semiMajorAxis, 3));


    TLEsecondLine += meanMotion.toString().slice(0, 11) + " ";

    return TLEsecondLine;
}



/******************************************************************/
/******************************************************************/
/*                   MATHMETICAL MODULES                          */
/******************************************************************/
/******************************************************************/

function degreeToRadians(degree) {
    return degree / 57.2958;
}
function radianToDegree(radian) {
    return radian * 57.2958;
}
function getMagnitudeOfMetrix(mat) {
    return Math.sqrt((Math.pow(mat[0], 2) + Math.pow(mat[1], 2) + Math.pow(mat[2], 2)))
}
function vectoricalMultiple(mat1, mat2) {
    return [
        mat1[1] * mat2[2] - mat1[2] * mat2[1],
        mat1[2] * mat2[0] - mat1[0] * mat2[2],
        mat1[0] * mat2[1] - mat1[1] * mat2[0]
    ]
}
function multipleScalarAndVector(mat, scalar) {
    return [mat[0] * scalar, mat[1] * scalar, mat[2] * scalar];
}
function scalaricMultiple(mat1, mat2) {
    return (mat1[0] * mat2[0]) + (mat1[1] * mat2[1]) + (mat1[2] * mat2[2])
}
function vectoricalSubtraction(mat1, mat2) {
    return [mat1[0] - mat2[0], mat1[1] - mat2[1], mat1[2] - mat2[2]]
}
