const MockEs6Class = require('../mock-es6-class');

const SimplePrint = require('./data/simple-print');
const mockEs6Class = new MockEs6Class(SimplePrint);
const mockSimplePrint = mockEs6Class.getMock();

describe('MockEs6Class Tests', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Simple class definition', () => {
    it('Should use the mocked class print method instead of the real class print method', () => {

      mockSimplePrint.print.mockImplementation(() => 42);

      jest.mock('./data/simple-print', () => mockSimplePrint.classDefinition); // replace real class simple-print for all requires
      const testCase = require('./data/simple-print-example');

      expect(testCase.simplePrintExample()).toEqual(42);
      expect(mockSimplePrint.print).toHaveBeenCalledWith(['something']);
      expect(mockSimplePrint.constructor).toHaveBeenCalledWith([console]);
    });
  });

});