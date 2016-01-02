module.exports = {
  /**
   *
   */
  createToken: function(req, res) {
    var request = AuthenticationService.extractHeaders(res.req);
    AuthenticationService.create(request, null, '1.0', function(token, resourceId) {
      AuthenticationService.decode(token, function(decode) {
        AuthenticationService.compare(decode.properties.integrity, request, function(match) {
          res.ok({
            match: match,
            token: token,
            decode: decode
          });
        });
      });
    });
  }
};