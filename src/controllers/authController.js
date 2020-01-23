const { Router } = require("express");
const router = Router();

const jwt = require("jsonwebtoken");
const config = require("../config");
const verifyToken = require("./verifyToken");

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

// A token is needed to access to this route
router.get("/profile", verifyToken, async (req, res, next) => {
  // Return the user data (without the password) if exists in the DB
  const user = await User.findById(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("The email does not exist");
  }

  const validPassword = await user.validatePwd(password);
  if (!validPassword) {
    return res.status(401).json({ auth: false, token: null });
  }
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24
  });

  res.json({ auth: true, token: token });
});

module.exports = router;
