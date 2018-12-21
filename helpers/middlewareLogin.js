const middlewareLogin = function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login')
  }
  next()
}

module.exports = middlewareLogin;