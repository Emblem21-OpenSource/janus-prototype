var crypto = require('crypto');

var service = module.exports = {

  /**
   *
   */
  getRange: function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  /**
   *
   */
  getRandom: function(length, done) {
    if(length === undefined) {
      length = 32;
    }

    return crypto.randomBytes(length, function(ex, buf) {
      done(buf.toString('hex').substr(0, length));
    });
  },

  /**
   *
   */
  getSha256: function(string, output) {
    if(output === undefined) {
      output = 'hex';
    }

    return crypto.createHash('sha256').update(string).digest(output);
  },

  /**
   *
   */
  encrypt: function(string, key, done) {
    var self = this;
    self.getRandom(12, function(iv) {
      var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      var encrypted = cipher.update(string, 'utf8', 'hex');
      encrypted += cipher['final']('hex');
      var tag = cipher.getAuthTag().toString('hex');
      return done({
        content: encrypted,
        tag: tag,
        iv: iv
      });
    });
  },

  /**
   *
   */
  decrypt: function(content, key, iv, tag) {
    var decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(new Buffer(tag, 'hex'));
    var dec = decipher.update(content, 'hex', 'utf8');
    dec += decipher['final']('utf8');
    return dec;
  }
};

