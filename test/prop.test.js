var jsc = require("jsverify");
var _ = require("lodash");
var gen = jsc.generator;
var compose = (f, g) => x => f(g(x));
var id = x => x;
var complement = f => x => !f(x);
var doubleComplement = compose(complement, complement);

var arbType = jsc.elements(['string', 'number', 'bool', 'json']);

var itIsFunction = jsc.forall(arbType, arbType, arbType, (t1, t2, t3) => {
  return jsc.forall(jsc.fn(jsc[t1], jsc[t2]), jsc.fn(jsc[t2], jsc[t3]), (f, g) => {
    return typeof compose(f, g) === 'function';
  })
})

var isValid = jsc.forall(arbType, arbType, arbType, (t1, t2, t3) => {
  return jsc.forall(jsc.fn(jsc[t1], jsc[t2]), jsc.fn(jsc[t2], jsc[t3]), (f, g) => {
    var composed = compose(f, g);
    return jsc.forall(jsc[t1], x => {
      var res = f(g(x));
      var resComposed = composed(x);
      return res === resComposed;
    })
  })
})

var isAssociative = jsc.forall(arbType, arbType, arbType, arbType, (t1, t2, t3, t4) => {
  return jsc.forall(jsc.fn(jsc[t1], jsc[t2]), jsc.fn(jsc[t2], jsc[t3]), jsc.fn(jsc[t3], jsc[t4]), (f, g, h) => {
    var composedLeft = compose(f, compose(g, h));
    var composedRight = compose(compose(f, g), h);
    return jsc.forall(jsc[t1], x => composedLeft(x) === composedRight(x));
  })
})


var isIdNotChangeAnything = jsc.forall(arbType, arbType, arbType, (t1, t2) => {
  return jsc.forall(jsc.fn(jsc[t1], jsc[t2]), f => {
    var leftWithId = compose(f, id);
    var rigthWithId = compose(id, f);
    return jsc.forall(jsc[t1], x => leftWithId(x) === f(x) && rigthWithId(x) === f(x))
  })
})

var isDoubleComplementIdent = jsc.forall(jsc.fn(jsc.bool), f => {
  var doubleComplemented = doubleComplement(f);
  return jsc.forall(jsc.bool, x => doubleComplemented(x) === f(x))
})

jsc.check(isValid)
jsc.check(isAssociative)
jsc.check(itIsFunction)
jsc.check(isIdNotChangeAnything)
jsc.check(isDoubleComplementIdent)



