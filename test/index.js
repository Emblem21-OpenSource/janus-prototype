var _  = require('lodash');
var async = require('async');
var janus = require('../src/startup');
var Supertest = require('supertest');
var port = 8889;

function noop(result, nextData, done) {
  done();
}

/**
 *
 */
function createTester() {
  var Supertest = require('supertest');
  var result = Supertest(HttpService.server);
  delete require.cache[require.resolve('supertest')];
  return result;
}

var suite = {

  /**
   *
   */
  mock: function(mock) {
    var result = {};
    for(var i in mock) {
      result[i] = jasmine.createSpy(i).and.callFake(mock[i]);
    }
    return mock;
  },

  /**
   *
   */
  actor: function(username, done, error) {
    var tester = createTester();
    tester.post('/accounts').send({
      username: username,
      password: 'test'
    }).end(function(err, account) {
      if(err || account.error) {
        return error(err || account.error);
      }
      return tester.post('/login').send({
        username: username,
        password: 'test'
      }).end(function(err, jwt) {
        if(err || jwt.error) {
          return error(err || jwt.error);
        }
        return done(function(method, uri, values) {
          return tester[method](uri).set('Authorization', 'Bearer ' + jwt.body).send(values);
        }, account);
      });
    });
  },

  scenario: function(actor, instructions, done) {
    var tasks = [];
    _.forEach(instructions, function(instruction, index) {
      if(instruction.action === 'wait') {
        if(instruction.data === undefined) {
          next('Wait amount not set in scenario.');
        }
        tasks.push(function(next) {
          setTimeout(function() {
            next(null, null);
          }, instruction.data);
        });
      } else {
        tasks.push(function(next) {
          actor(instruction.action.toLowerCase(), instruction.uri, instruction.data).end(function(err, result) {
            if(err || result.error) {
              return next(err || result.error);
            }

            if(instruction.after) {
              var nextData = instruction[index + 1] ? instruction[index + 1].after : {};
              return instruction.after(result.body, nextData, function(err) {
                next(err, result.body);
              });
            } else {
              return next(null, result.body);
            }
          });
        });
      }
    });

    async.series(tasks, function(err, result) {
      if(err) {
        throw new Error(err);
      }
      done(result);
    });
  },

  /**
   *
   */
  instruction: function(action, uri, data, after) {
    return {
      action: action,
      uri: uri,
      data: data,
      after: after || noop
    };
  }
};

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('test/config.json');
jasmine.configureDefaultReporter({
    showColors: true,
    captureExceptions: false
});
jasmine.onCompleteCallbackAdded = false;

jasmine.onComplete(function(passed) {
  process.exit(passed ? 0 : 1);
});

// Start up the server
janus({
  port: port,
  environment: 'test',
  log: console.log
}, function() {
  suite.actor('bob', function() {
    jasmine.execute(); 
  });
  
});

module.exports = suite;