import chai from 'chai';
const expect = chai.expect;
const plugin = require('../../../webpack/plugins/post-css/base-unit/');
const postcss = require('postcss');
const options = {
  baseUnit: 8,
  units: 'px',
};

function process(css, options) {
  return postcss(plugin(options)).process(css).css;
}

describe('Base Unit plugin', () => {
  describe('is a function', () => {
    it('should be a function', () => {
      expect(plugin).to.be.a.function;
    });
  });

  describe('matching algorithm', () => {

    it('should match integers and floating points with push()', () => {

      const fixtureA = 'h1{margin: push(1)}';
      const expectedA = 'h1{margin: 8px}';

      expect(process(fixtureA, options)).to.eql(expectedA);

      const fixtureB = 'h1{margin: push(1.1)}';
      const expectedB = 'h1{margin: 8.8px}';

      expect(process(fixtureB, options)).to.eql(expectedB);
    });

    it('should match integers and floating points with pull()', () => {

      const fixtureA = 'h1{margin: pull(1)}';
      const expectedA = 'h1{margin: -8px}';

      expect(process(fixtureA, options)).to.eql(expectedA);

      const fixtureB = 'h1{margin: pull(1.1)}';
      const expectedB = 'h1{margin: -8.8px}';

      expect(process(fixtureB, options)).to.eql(expectedB);
    });

    it('should support shorthand css notation', () => {

      const fixtureA = 'h1{margin: push(1) push(2)}';
      const expectedA = 'h1{margin: 8px 16px}';

      expect(process(fixtureA, options)).to.eql(expectedA);

      const fixtureB = 'h1{margin: push(1) push(2) push(0.5)}';
      const expectedB = 'h1{margin: 8px 16px 4px}';

      expect(process(fixtureB, options)).to.eql(expectedB);

      const fixtureC = 'h1{margin: push(1) push(2) push(0.5) push(1)}';
      const expectedC = 'h1{margin: 8px 16px 4px 8px}';

      expect(process(fixtureC, options)).to.eql(expectedC);
    });

    it('should not affect other css properties', () => {
      const fixtureA = 'h1{margin: push(1);color:red;}';
      const expectedA = 'h1{margin: 8px;color:red;}';

      expect(process(fixtureA, options)).to.eql(expectedA);

      const fixtureB = 'h1{margin: push(1) push(2) 9px;color:red;}';
      const expectedB = 'h1{margin: 8px 16px 9px;color:red;}';

      expect(process(fixtureB, options)).to.eql(expectedB);
    });

  });
});
