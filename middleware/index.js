var middleware = {
    isLoggedIn: function(request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        response.redirect("/login");
    }
}


module.exports = middleware;