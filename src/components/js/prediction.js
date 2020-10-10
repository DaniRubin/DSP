// const LM = require('ml-levenberg-marquardt');
const fmin = require('fmin');

const createVectorArray = (vectorList) => {
  const vectors = []
  Object.keys(vectorList).forEach(key => {
    const elementArray = []
    Object.keys(vectorList[key]).forEach(elementKey => {
      elementArray.push(vectorList[key][elementKey]);
    });
    vectors.push(elementArray);
  });
  return vectors;
}
const convertVectorToObject = (vector) => {
  return {
    "Ri": vector[0],
    "Rj": vector[1],
    "Rk": vector[2],
    "Vi": vector[3],
    "Vj": vector[4],
    "Vk": vector[5]
  }
}
const convertObjectToVector = (obj) => {
  const vector = []
  Object.keys(obj).forEach(elementKey => {
    vector.push(obj[elementKey]);
  });
  return vector;
}
const createInitialVector = (originalVector, Rdiff, Vdiff) => {
  const initialVector = []
  Object.keys(originalVector).forEach(key => {
    if (key.includes('R')) {
      const numberToAdd = Math.random() * Rdiff;
      const ans = originalVector[key] + numberToAdd;
      initialVector.push(ans);
    } else {
      const numberToAdd = Math.random() * Vdiff;
      const ans = originalVector[key] + numberToAdd;
      initialVector.push(ans);
    }
  });
  return initialVector;
}
let log = '';
let globalCounter = 0;

const makeRunAlgorithem = (costFunction, vector, iterationNumber) => {
  if (iterationNumber <= 0) {
    alert("Iteration number is invalid!");
    return null;
  }
  console.log(`Try number 1 globalCounter - ${globalCounter}`);
  log += `Try number ${1}! ${vector}\n`;
  let solution = fmin.nelderMead(costFunction, vector);
  console.log("solution is at " + solution.x);
  for (let i = 1; i < iterationNumber; i++) {
    console.log(`Try number ${i + 1} globalCounter - ${globalCounter}`);
    log += `Try number ${i + 1}! ${solution.x}\n`;
    solution = fmin.nelderMead(costFunction, solution.x.slice());
  }
  return solution;
}
exports.predictionFunction = (originalVec, vectorList, tle, setOutput, SGP, predictByVector, config) => {
  const startTime = new Date().getTime();
  const vectors = createVectorArray(vectorList);
  let failareCounter = 0;
  function costFunction(vec) {
    let sum = 0
    for (let i = 0; i < vectors.length; i++) {
      const now = startTime + ((90 * 60 * 1000) * (i + 1));
      const vecObject = convertVectorToObject(vec);
      let relevantVec;
      const positionAndVelocity = predictByVector(vecObject, tle, now, SGP, config);
      if (!positionAndVelocity) {
        failareCounter++;
        relevantVec = vec.slice();
      } else {
        relevantVec = convertObjectToVector(positionAndVelocity);
      }
      for (let j = 0; j < relevantVec.length; j++) {
        sum += Math.sqrt((relevantVec[j] - vectors[i][j]) ** 2);
      }
    }
    globalCounter += 1;
    log += `${globalCounter}. cost function - ${sum} \n`;
    return sum;
  }
  //Creation of the initial vector
  let initialVector = createInitialVector(originalVec, 500, 0.2);
  console.log("Original vector is - ", originalVec);
  console.log("initial vector is - ", initialVector);

  // let solution = fmin.nelderMead(costFunction, initialVector.slice());
  const solution = makeRunAlgorithem(costFunction, initialVector.slice(), 1);

  console.log('\n\n');
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