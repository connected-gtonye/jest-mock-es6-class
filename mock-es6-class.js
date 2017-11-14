
class MockEs6Class {
  /**
   * @param an class {} object
   * * */
  constructor(anEs6ClassDefinition) {
    this.anEs6ClassDefinition = anEs6ClassDefinition;
  }

  /**
   * @return {
   *  classDefinition: class {} object with a constructor and same methods name
   *  as the es6 class object passed as parameter of the MockEs6Class, and each method
   *  is proxying to a jest function (jest.fn())
   * }
   * ...: a list of keys corresponding to each methods of the es6 class parameter given
   * as a class parameter
   * * */
  getMock() {
    const methods = {
      constructor: jest.fn(),
    };
    class classDefinition {
      constructor(...args) { // when constructor is set in prototype, it is never called
        methods.constructor(args);
      }
    }

    Object.getOwnPropertyNames(this.anEs6ClassDefinition.prototype).forEach((method) => {
      if (method !== 'constructor') {
        methods[method] = jest.fn();
        classDefinition.prototype[method] = (...args) => methods[method](args);
      }
    });

    return Object.assign(methods, { classDefinition });
  }
}

module.exports = MockEs6Class;

