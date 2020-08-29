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