import compose from '../module';
import { curry, _ } from 'curry-this';
const { check, property, gen } = require('testcheck');

import test from 'tape-catch';

test('#compose', ( { deepEqual: deep, equal: eq, throws, end } ) => {
  const sqr = x => x * x;
  const inc = x => x + 1;

  eq(typeof compose, 'function');

  throws(compose.bind(1));

  eq(compose(sqr, inc)(2), sqr(inc(2)));
  eq(sqr(inc(2)), 9);
  eq(compose(sqr, inc)(2), 9);

  const add = (x, y) => x + y;

  eq(compose(
      add::curry(6),
      sqr,
      add::curry(2)
    )(2),
    add(6, sqr(add(2, 2)))
  );
  // (f ∘ g)(x) = f(g(x))
  const even = x => x%2 === 0;
  const map = (arr, fn) => arr.map(fn);
  const filter = (arr, fn) => arr.filter(fn);

  deep(compose(
      map::curry(_, sqr),
      filter::curry(_, even),
    )([1,2,3,4,5,6,7,8]), [4, 16, 36, 64]);

  // # prop based testing
  // ## helpers
  const id = x => x;
  const complement = x => -x;
  // ## properties
  const isFn = (f, g) => typeof compose(f, g) === 'function';
  const valid = (f, g, x) => compose(f, g)(x) === f(g(x));
  const associative = (f, g, h, x) => compose(f, compose(g, h))(x) === compose(compose(f, g), h)(x);
  // ## additional properties
  const worksWithId = (f, x) => compose(f, id)(x) === f(x);
  const doubleComplement = (x) => compose(complement, complement)(x) === x;

  eq(
    check(property([gen.fn, gen.fn], isFn)).result,
    true
  )

  end();
});
