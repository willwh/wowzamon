
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.loggedIn) {
    req.flash('notice', 'You are not authorized. Please login')
    res.redirect('/servers')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.foundUser.id != req.session.auth.userId) {
        req.flash('notice', 'You are not authorized')
        res.redirect('/profile/'+req.foundUser.id)
      }
      next()
    }
}


/*
 *  Server authorizations routing middleware
 */

exports.server = {
    hasAuthorization : function (req, res, next) {
      if (req.server.owner.id != req.session.auth.userId) {
        req.flash('notice', 'You are not authorized');
        res.redirect('/server/'+req.server.id);
      }
      next()
    }
}  
