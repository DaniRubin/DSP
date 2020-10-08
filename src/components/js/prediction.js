// const LM = require('ml-levenberg-marquardt');
const fmin = require('fmin');
const vectors = [
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 6],
  [0, 1, 2, 3, 4, 7],
  [0, 1, 2, 3, 4, 8],
  [0, 1, 2, 3, 4, 9],
  [0, 1, 2, 3, 4, 10],
  [0, 1, 2, 3, 4, 11],
]
exports.predictionFunction = (originalVec, vectorList, tle, setOutput, SGP, predictByVector, config) => {
  const startTime = new Date().getTime();
  const vectors = []
  Object.keys(vectorList).forEach(key => {
    const elementArray = []
    Object.keys(vectorList[key]).forEach(elementKey => {
      elementArray.push(vectorList[key][elementKey]);
    });
    vectors.push(elementArray);
  });
  let log = "";
  let globalCounter = 0
  let failareCounter = 0
  function costFunction(vec) {
    let sum = 0
    for (let i = 0; i < 10; i++) {
      const now = startTime + ((90 * 60 * 1000) * (i + 1));
      const vecConvention = {
        "Ri": vec[0],
        "Rj": vec[1],
        "Rk": vec[2],
        "Vi": vec[3],
        "Vj": vec[4],
        "Vk": vec[5]
      }
      // console.log(vecConvention)
      let relevantVec;
      console.log(now)
      const positionAndVelocity = predictByVector(vecConvention, tle, now, SGP, config);
      if (!positionAndVelocity) {
        failareCounter++;
        relevantVec = vec.slice();
      } else {
        relevantVec = []
        Object.keys(positionAndVelocity).forEach(elementKey => {
          relevantVec.push(positionAndVelocity[elementKey]);
        });
      }
      console.log(globalCounter, relevantVec);
      for (let j = 0; j < 6; j++) {
        sum += Math.sqrt((relevantVec[j] - vectors[i][j]) ** 2);
      }
    }
    globalCounter += 1;
    log += `${globalCounter}. cost function - ${sum} \n`;
    return sum
  }
  //Creation of the initial vector
  let initialVector = []
  Object.keys(originalVec).forEach(key => {
    if (key.includes('R')) {
      const numberToAdd = Math.random() * 500
      const ans = originalVec[key] + numberToAdd
      initialVector.push(ans);
    } else {
      const numberToAdd = Math.random() * 0.2
      const ans = originalVec[key] + numberToAdd
      initialVector.push(ans);
    }
  });
  console.log("Original vector is - ", originalVec);
  console.log("initial vector is - ", initialVector);

  let solution = fmin.nelderMead(costFunction, initialVector.slice());
  // log += `Second try! ${solution.x}\n`
  // solution = fmin.conjugateGradient(costFunction, solution.x.slice());
  // log += `Third try! ${solution.x}\n`
  // solution = fmin.conjugateGradient(costFunction, solution.x.slice());
  // log += `Forth try! ${solution.x}\n`
  // solution = fmin.conjugateGradient(costFunction, solution.x.slice());
  // log += `Fifth try! ${solution.x}\n`
  // solution = fmin.conjugateGradient(costFunction, solution.x.slice());


  console.log();
  console.log("solution is at " + solution.x);
  log = `steps -   ${globalCounter}\n\n\n\n${log}`;
  log = `Fail rate -  -   ${failareCounter / (globalCounter * 10)}\n${log}`;
  log = `Fails -   ${failareCounter}\n${log}`;
  log = `solution is at  ${solution.x}\n\n${log}`;
  log = `initial was at  ${initialVector}\n\n${log}`;
  setOutput(log);

}
// const ans = this.predictionFunction(vectors);
// console.log(ans)





// const options = {
//   damping: 1.5,
//   initialValues: initialVector,
//   gradientDifference: 10e-2,
//   maxIterations: 1000,
//   errorTolerance: 10e-3
// };

// let fittedParams = LM(allVectors, costFunction, options);
// // console.log(fittedParams)