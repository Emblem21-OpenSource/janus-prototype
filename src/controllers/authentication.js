module.exports = {
  /**
   *
   */
  createToken: function(req, res) {
    IdentityService.create(res.req, null, '1.0', function(token, resourceId) {
      IdentityService.decode(token, function(decode) {
        IdentityService.compare(decode.properties.integrity, res.req, function(diff) {
          res.ok({
            diff: diff,
            token: token,
            decode: decode
          });
        });
      });
    });
  }
};