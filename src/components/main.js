
exports.readFile = async (e, changeTLEcontent) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
        const text = (e.target.result)
        changeTLEcontent(text);
    };
    reader.readAsText(e.target.files[0])
}
exports.makeTLEexplain = () => {

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