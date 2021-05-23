exports.isLoggedIn = (req, res, next) => {
  var user_id = req.session.user_id;
  if(!user_id) {
      res.render("admin_login", { title: "", session: req.session });
  } else {
    next();
  }
};
