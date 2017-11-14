class SimplePrint {
  constructor(consoleInstance) {
    this.consoleInstance = consoleInstance;
  }
  print(something) {
    this.consoleInstance.log(something);
    return 24;
  }
}

module.exports = SimplePrint;