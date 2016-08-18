const { check, property, gen } = require('testcheck');

const sum = (a, b) => a + b;

const zero = x => sum(x, 0) === x;
const commutative = (x, y) => sum(x, y) === sum(y, x);
const associative = (x, y, z) => sum(x, sum(y, z)) === sum(sum(x, y), z);

const result1 = check(
  property([gen.int], zero)
);

const result2 = check(
  property([gen.int, gen.int], commutative)
);
const result3 = check(
  property([gen.int, gen.int, gen.int], associative)
);

console.log({ result1, result2, result3 });
