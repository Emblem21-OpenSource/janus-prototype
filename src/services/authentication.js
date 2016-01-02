var jwt = require('jsonwebtoken');
var uuid = require('uuid');

module.exports = {

  /**
   *
   */
  create: function(identifier, properties) {
    return jwt.sign({
      identifier: identifier,
      properties: properties || {}
    }, Config.api.jwt.secret, Config.api.jwt);
  },

  /**
   *
   */
  decode: function(token, next, error) {
    jwt.verify(token, Config.api.jwt.secret, Config.api.jwt, function (err, decoded) {
      if (err || !decoded.identifier) {
        return error(err || !decoded.identifier);
      }
      return next(decoded);
    });
  },

  /**
   *
   */
  generateKeySegments: function() {
    var result = '';
    for(var j = 1, max = 50; j<max; j++) {
      result += ':'+j+':' + crypto.randomBytes(256).toString('base64');
    }
    return result;
  },

  /**
   *
   */
  generateResourceId: function(entropy) {
    return RandomUtil.getSha256(entropy + uuid.v4({
      rng: uuid.nodeRNG
    }));
  }
};