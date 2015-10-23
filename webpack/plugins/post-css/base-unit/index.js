const postcss = require('postcss');
const R = require('ramda');

const defaults = {
  baseUnit: 1,
  units: 'em',
};

function calcUnits(count, baseUnit) {
  return count * baseUnit;
}

function push(count, baseUnit) {
  return calcUnits(count, baseUnit) * 1;
}

function pull(count, baseUnit) {
  return calcUnits(count, baseUnit) * -1;
}

const methodMap = {
  push: push,
  pull: pull,
};

function extractMethod(value) {
  const method = value.match(/(push|pull)/)[0];
  return methodMap[method];
}

function roundTo3DecimalPlaces(fn) {
  return Math.round(
    parseFloat(
      fn.call(this)
    ) * 1000
  ) / 1000;
}

function extractValue(value, options) {

  const extractedValue = value.match(/(\d{1,9}(\.\d{1,9})?)/)[0];

  // Round three decimal places.
  const rounded = roundTo3DecimalPlaces(() => {
    return extractMethod(value)(extractedValue, options.baseUnit);
  }).toString();

  // Change the value in the tree.
  return rounded + options.units;
}

const testValue = R.curry((options, value) => {
  const valueTest = /(push|pull)(\(\d{1,9}(\.\d{1,9})?\))/gi;
  if (valueTest.test(value)) {
    return extractValue(value, options);
  }

  return value;
});

module.exports = postcss.plugin('postcss-base-units', (options) => {
  const opts = R.merge(defaults, options);

  return (css, result) => {
    css.eachDecl(function(decl) {
      decl.value = R.compose(
          R.join(' '),
          R.map(testValue(opts)),
          R.split(/\s+/)
        )(decl.value);

    });
  };
});
