function dispatch(request, response, action) {
  if(action === undefined) {
    return response.send(500);
  }
  return action(request, response);
}

module.exports = {

  routes: {},

  /**
   *
   */
  add: function(method, path, action, policies) {
    if(this.routes[method] === undefined) {
      this.routes[method] = {};
    }

    if(this.routes[method][path] === undefined) {
      this.routes[method][path] = {
        action: action,
        policies: policies || []
      };
    }
  },

  /**
   *
   */
  route: function(request, response) {
    if(request.path.indexOf('.') != -1) {
      return response.send(403);
    }

    if(this.routes[request.method] === undefined) {
      return response.send(404);
    }

    if(this.routes[request.method][request.path] === undefined) {
      return response.send(404);
    }

    if(this.routes[request.method][request.path].action === undefined) {
      return response.send(404);
    }

    var route = this.routes[request.method][request.path];

    if(route.policies.length === 0) {
      return dispatch(request, response, route.action);
    }

    var total = 0;

    for(var i = 0, len = route.policies.length; i<len; i++) {
      (function(policy) {
        policy(request, response, function() {
          total += 1;
          if(total == route.policies.length) {
            dispatch(request, response, route.action);
          }
        });
      })(route.policies[i]);
    }

    return null;
  }
};