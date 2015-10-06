var chai = require("chai");
var expect = chai.expect;
var plugin = require("../../../webpack/plugins/post-css/base-unit/");
var postcss = require('postcss');
var options = {
  baseUnit: 8,
  units: "px"
};

function process (css, options) {
  return postcss(plugin(options)).process(css).css;
}

describe('Base Unit plugin', function() {
  describe('is a function', function () {
    it('should be a function', function () {
      expect(plugin).to.be.a.function;
    });
  });

  describe('matching algorithm', function () {
    it('should match integers and floating points with push()', function () {

      fixture = "h1{margin: push(1)}";
      expected = "h1{margin: 8px}";

      expect(process(fixture, options)).to.eql(expected);
    });

    it('should match integers and floating points with pull()', function () {

      fixture = "h1{margin: pull(1)}";
      expected = "h1{margin: -8px}";

      expect(process(fixture, options)).to.eql(expected);
    });

    it('should support shorthand css notation', function () {

      fixture = "h1{margin: push(1) push(2)}";
      expected = "h1{margin: 8px 16px}";

      expect(process(fixture, options)).to.eql(expected);

      fixture = "h1{margin: push(1) push(2) push(0.5)}";
      expected = "h1{margin: 8px 16px 4px}";

      expect(process(fixture, options)).to.eql(expected);

      fixture = "h1{margin: push(1) push(2) push(0.5) push(1)}";
      expected = "h1{margin: 8px 16px 4px 8px}";

      expect(process(fixture, options)).to.eql(expected);
    });

  });
});
