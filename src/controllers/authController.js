const { Router } = require("express");
const router = Router();

const jwt = require("jsonwebtoken");
const config = require("../config");

const User = require("../models/User");

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({
    username: username,
    email: email,
    password: password
  });
  user.password = await user.encryptPwd(user.password);
  await user.save();

  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24
  });

  res.json({ auth: true, token: token });
});

router.post("/signin", (req, res, next) => {
  res.json("signin");
});

router.get("/profile", (req, res, next) => {
  res.json("profile");
});

module.exports = router;
