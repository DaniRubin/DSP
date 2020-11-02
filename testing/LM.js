// import library
// const LM = require('ml-levenberg-marquardt').default;
const LM = require('ml-levenberg-marquardt');

function sinFunction([a, b]) {
  return (t) => a * Math.sin(b * t);
}

// array of points to fit
let data = {
  x: [
    1, 2, 3, 4, 5
  ],
  y: [
    1, 2, 3, 4, 5
  ]
};

// array of initial parameter values
let initialValues = [
  /* a, b, c, ... */
];

// Optionally, restrict parameters to minimum & maximum values
let minValues = [
  /* a_min, b_min, c_min, ... */
];
let maxValues = [
  /* a_max, b_max, c_max, ... */
];

const options = {
  damping: 1.5,
  // initialValues: initialValues,
  // minValues: minValues,
  // maxValues: maxValues,
  gradientDifference: 10e-2,
  maxIterations: 100,
  errorTolerance: 10e-3
};

let fittedParams = LM(data, sinFunction, options);
console.log(fittedParams)