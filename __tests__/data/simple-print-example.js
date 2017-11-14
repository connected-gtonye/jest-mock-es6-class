
const SimplePrint = require('./simple-print');
const aSimplePrintInstance = new SimplePrint(console);

module.exports = {
  simplePrintExample: () => {
    return aSimplePrintInstance.print('something');
  }
}