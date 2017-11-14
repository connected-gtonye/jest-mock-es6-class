# Mock ES6 class

## Abstract

This module was created to become a helper when building test coverage for code.

#### Origin

When working unit testing, it is often useful to mock a lot of dependencies in a code.
For example in the code below:

```javascript
// send-notification.js
const CloudMailService = require('some-cloud-mail-npm-module'); // es6 class
const someConfiguration = require('./some-configuration'); // json object
const Utils = require('./utils'); // es6 class

const cloudMailService = new CloudMailService(someConfiguration);
module.exports = (recipient, notificationTextBody) => {
    if (Utils.isValid(recipient)) {
        return cloudMailService.send(re)
        .then(res => {
            if (res.status.statusCode === 200) {
                return 'NOTIFICATION_SUCCESS';
            } else {
                return 'SOMETHING_WRONG_HAPPENED';
            }
        });
    } else {
        return promise.reject();
    }
}

```
If we want to do some test overage, We would be interesting in mocking the dependencies.
In this case the isValid in Utils and send in cloud service.

A couple of options are available to do so:

###### Changing the send-notification signature and use Dependency Injection:
```javascript
// send-notification.js
module.exports = (recipient, notificationTextBody, cloudMailService, Utils) => {
    if (Utils.isValid(recipient)) {
        return cloudMailService.send(re, notificationTextBody)
        .then(res => {
            if (res.status.statusCode === 200) {
                return 'NOTIFICATION_SUCCESS';
            } else {
                return 'SOMETHING_WRONG_HAPPENED';
            }
        });
    } else {
        return promise.reject();
    }
}

// send-notification.test.js
const sendNotification = require('./send-notification');

describe('sendNotification testing', () => {
    it('Should return NOTIFICATION_SUCCESS if the notification was sent', () => {
        cloudMailService = {
            send: jest.fn(() => Promise.resolve({
                status:{
                    statusCode: 200
                }
            }))
        }

        Utils = {
            isValid: jest.fn(() => true)
        }

        expect(null, null, cloudMailService, Utils)
    });
});
```

> changing the function `someNotification` has consequence on the existing codebase

#### Problem

Jest (and other framework such as Sinon) provide tools to mock javascript module.
In the previous example:
```javascript
// send-notification.test.js

const mockedConfig = {
    aMockField: aMockValue
}

jest.mock('./some-configuration', () => mockedConfig);
// every require('./some-configuration')
// will return the mocked config.

const mockedUtilsClass = {
    isValid: jest.fn(() => true)
}

jest.mock('./utils', () => mockedUtilsClass);
// every require('./some-configuration')
// will return the mocked config.
// mockedUtilsClass allows full control
// of the behavior of isValid in the test

```

The issue is around `const CloudMailService = require('some-cloud-mail-npm-module');`
CloudMailService being an es6 class object, using the same method as for the classes above would not work as the mock would not control and track
`const cloudMailService = new CloudMailService(someConfiguration);`
One way to solve it could be:
```javascript
// send-notification.test.js
const mockConstructor = jest.fn();
const mockedSend = jest.fn();
class mockCloudMailService {
    constructor(...args) {
        mockConstructor(args);
    }

    send(...args) {
        return mockedSend(args);
    }
}

jest.mock('some-cloud-mail-npm-module', () => mockCloudMailService);
// require('some-cloud-mail-npm-module') will use mockCloudMailService
// and const cloudMailService = new CloudMailService() will actually do const cloudMailService = new mockCloudMailService()
// and mockedSend now give full control on every cloudMailService.send calls to defined
// behaviors and also assert expectation

describe('A test using the mocked es6 class', () => {
    it('Should use the mocked class method', () => {
        mockedSend.mockImplementation(() => {
            console.log('Using mocked send.');
            return 42;
        });
        const CloudMailService = require('some-cloud-mail-npm-module');
        const cloudMailService = new CloudMailService(42);
        expect(cloudMailService.send('cl@connectedlab.com', 'does it work')).toEquals(42);
        expect(mockedSend).toHaveBeenCalledWith(['cl@connectedlab.com', 'does it work']);
    });
});

```

> The issue is the need to write and instantiate a lot of variable in the test file

## mock-es6-class

The present modules aims to automate the generation of the mockClass and also avoid the needs to port the changes on the mocked class methods.
The previous example looks like this using the module:
```javascript
const MockEs6Class = require('mock-es6-class');
const CloudMailService = require('some-cloud-mail-npm-module');

const mockEs6Class = new MockEs6Class(CloudMailService);
const mockCloudMailService = mockEs6Class.getMock();


jest.mock('some-cloud-mail-npm-module', () => mockCloudMailService.classDefinition);
// mockCloudMailService.classDefinition holds the actual es6 class object
// mockedFetch is now within mockCloudMailService.send

describe('A test using the mocked es6 class', () => {
    it('Should use the mocked class method', () => {
        mockCloudMailService.send.mockImplementation(() => {
            console.log('Using mocked send.');
            return 42;
        });
        const CloudMailService = require('some-cloud-mail-npm-module');
        const cloudMailService = new CloudMailService(42);
        expect(cloudMailService.send('cl@connectedlab.com', 'does it work')).toEquals(42);
        expect(mockCloudMailService.send).toHaveBeenCalledWith(['cl@connectedlab.com', 'does it work']);
    });
});
```
The automated mock removes the need to write the definition for the mocked class.

## Foreword

#### Readings

Below links to useful documentation:
- [http://facebook.github.io/jest/](http://facebook.github.io/jest/)
- [https://martinfowler.com/articles/mocksArentStubs.html](https://martinfowler.com/articles/mocksArentStubs.html)
- [https://en.wikipedia.org/wiki/Single_responsibility_principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)