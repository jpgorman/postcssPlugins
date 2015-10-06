var postcss = require("postcss");
var R = require("ramda");

var defaults = {
  baseUnit: 1,
  units: "em"
}

var calcUnits = function (count, baseUnit) {
  return count * baseUnit;
}

var push = function (count, baseUnit) {
  return calcUnits(count, baseUnit) * 1;
}

var pull = function (count, baseUnit) {
  return calcUnits(count, baseUnit) * -1;
}

var methodMap = {
  push: push,
  pull: pull
};

var extractMethod = function (value) {
  var method = value.match(/(push|pull)/)[0];
  return methodMap[method];
}

var roundTo3DecimalPlaces = function (fn) {
  return Math.round(
    parseFloat(
      fn.call(this)
    ) * 1000
  ) / 1000;
}

var extractValue = function (value, options) {

  var extractedValue = value.match(/(\d{1,9}(\.\d{1,9})?)/)[0];
  // Round three decimal places.
  var rounded = roundTo3DecimalPlaces(function(){
    return extractMethod(value)(extractedValue, options.baseUnit);
  }).toString()

  // Change the value in the tree.
  return rounded + options.units;
}

var testValue = R.curry(function (options, value) {
  var valueTest = /(push|pull)(\(\d{1,9}(\.\d{1,9})?\))/gi;
  if (valueTest.test(value)) {
    return extractValue(value, options);
  }
})

module.exports = postcss.plugin('postcss-base-units', function (options) {
    var options = R.merge(defaults, options);

    return function (css, result) {
      css.eachDecl(function(decl) {

        decl.value = R.compose(
            R.join(" "),
            R.map(testValue(options))
          )(R.split(/\s+/, decl.value));

      });
    };
});
