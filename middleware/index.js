var middleware = {
    isLoggedIn: function (request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        response.redirect("/login");
    },

    checkOwnership: function (Object) {
        return function (request, response, next) {
            if (request.isAuthenticated()) {
                Object.findById(request.params.id, function (error, object) {
                    if (error) {
                        response.redirect("back");
                    } else {
                        if (object.author.id.equals(request.user._id)) {
                            next();
                        } else {
                            response.redirect("back");
                        }
                    }
                });
            } else {
                response.redirect("back");
            }
        }
    }




}



module.exports = middleware;