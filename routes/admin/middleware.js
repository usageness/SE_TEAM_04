exports.isLoggedIn = (req, res, next) => {
  var userid = req.session.userid;
  if(!userid) {
      res.render("admin_login", { title: "", session: req.session });
  } else {
    next();
  }
};