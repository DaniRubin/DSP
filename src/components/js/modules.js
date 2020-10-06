exports.validateVector = (vector) => {
  const isValid = !(vector['Ri'] !== undefined &&
    vector['Rj'] !== undefined &&
    vector['Rk'] !== undefined &&
    vector['Vi'] !== undefined &&
    vector['Vj'] !== undefined &&
    vector['Vk'] !== undefined)
  return isValid;
}
exports.genrateRandom = () => {
  const newVector = {
    "Ri": Math.random() * (Math.random() < 0.5 ? 3000 + 6000 : -3000 - 6000),
    "Rj": Math.random() * (Math.random() < 0.5 ? 6000 + 6000 : -6000 - 6000),
    "Rk": Math.random() * (Math.random() < 0.5 ? 6000 + 6000 : -6000 - 6000),
    "Vi": Math.random() * (Math.random() < 0.5 ? 10 : -10),
    "Vj": Math.random() * (Math.random() < 0.5 ? 10 : -10),
    "Vk": Math.random() * (Math.random() < 0.5 ? 10 : -10),
  }
  return newVector;
}

exports.getOclidianDestance = (v1, v2) => {
  console.log(v1);
  console.log(v2);
  console.log(v1["Ri"]);
  console.log((v1["Ri"] - v2["Ri"]) * (v1["Ri"] - v2["Ri"]));

  const ans = Math.sqrt(
    Math.pow(v1["Ri"] - v2["Ri"], 2) +
    Math.pow(v1["Rj"] - v2["Rj"], 2) +
    Math.pow(v1["Rk"] - v2["Rk"], 2)
  );
  return ans;
}