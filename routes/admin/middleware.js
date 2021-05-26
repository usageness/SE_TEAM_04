exports.isLoggedIn = (req, res, next) => {
  let user_id = req.session.user_id;
  let permission = req.session.permission;

  if(!user_id || !permission) {
      res.render("admin_login", { title: "", session: req.session, permission: permission });
  } else {
    next();
  }
};
