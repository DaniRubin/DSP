// const LM = require('ml-levenberg-marquardt');
const fmin = require('fmin');
vectors = [
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 6],
  [0, 1, 2, 3, 4, 7],
  [0, 1, 2, 3, 4, 8],
  [0, 1, 2, 3, 4, 9],
  [0, 1, 2, 3, 4, 10],
  [0, 1, 2, 3, 4, 11],
]
exports.predictionFunction = (vectors) => {
  function costFunction(vec) {
    let sum = 0
    for (i = 0; i < vectors.length; i++) {
      //create from the vector a genrated vector for the relvant time
      relevantVec = vec;
      for (j = 0; j < vec.length; j++) {
        sum += ((relevantVec[j] - vectors[i][j]) ** 2);
      }
    }
    console.log(sum)
    return sum
  }
  let initialVector = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
  const solution = fmin.nelderMead(costFunction, initialVector);
  console.log("solution is at " + solution.x);
  console.log(solution);
  return solution
}
ans = this.predictionFunction(vectors);
console.log(ans)





// const options = {
//   damping: 1.5,
//   initialValues: initialVector,
//   gradientDifference: 10e-2,
//   maxIterations: 1000,
//   errorTolerance: 10e-3
// };

// let fittedParams = LM(allVectors, costFunction, options);
// // console.log(fittedParams)