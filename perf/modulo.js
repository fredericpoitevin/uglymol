'use strict';

var Benchmark = Benchmark || require('benchmark'); // eslint-disable-line
let suite = new Benchmark.Suite();

const VALUES = [21.2, 30.5, 25.9, -7.2, 0.4, -0.4];
//const VALUES = [21, 30, 26, -7, 0, -1];
const M = 3;
let res = [0, 0];

// like Math.euclideanModulo() from three.js
suite.add('%,+,%', function () {
  res[0] = 0;
  for (let i = 0; i < VALUES.length; i++) {
    const n = VALUES[i];
    res[0] += ((n % M) + M) % M;
  }
});

suite.add('%,if,+=', function () {
  res[1] = 0;
  for (let i = 0; i < VALUES.length; i++) {
    const n = VALUES[i];
    let x = n % M;
    if (x < 0) {
      x += M;
    }
    res[1] += x;
  }
});

suite.on('cycle', function (event) { console.log(' ' + event.target); });
suite.run();
console.log('  results: ' + res.join(', '));


const NUMBERS = ['   2', ' 131', '  88', '3032', ' 912', '6312', '8194', '518'];
suite = new Benchmark.Suite();
res = [0, 0, 0, 0, 0];
suite.add('Number', function () {
  res[0] = 0;
  for (let i = 0; i < NUMBERS.length; i++) res[0] += Number(NUMBERS[i]);
});

suite.add('|0', function () {
  res[1] = 0;
  for (let i = 0; i < NUMBERS.length; i++) res[1] += NUMBERS[i] | 0;
});

suite.add('Number|0', function () {
  res[2] = 0;
  for (let i = 0; i < NUMBERS.length; i++) res[2] += Number(NUMBERS[i]) | 0;
});

suite.add('parseInt()', function () {
  res[3] = 0;
  // eslint-disable-next-line radix
  for (let i = 0; i < NUMBERS.length; i++) res[3] += parseInt(NUMBERS[i]);
});

suite.add('parseInt(,10)', function () {
  res[4] = 0;
  for (let i = 0; i < NUMBERS.length; i++) res[4] += parseInt(NUMBERS[i], 10);
});

suite.on('cycle', function (event) { console.log(' ' + event.target); });
suite.run();
console.log('  results: ' + res.join(', '));
