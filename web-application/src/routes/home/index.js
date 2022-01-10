/* path: / */

const router = require("express").Router();

const env = require("../../environment");
const { isAuthorized } = require("../../session");

router.get("/", isAuthorized, (req, res) => {
  env.log("GET", `${env.WA.URI}/`);

  const sess = req.session;

  const data = {
    email: sess.user.email,
  };

  res.render("home", data);
});

module.exports = router;
