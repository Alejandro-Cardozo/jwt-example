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

router.get("/profile", async (req, res, next) => {
  // A token is needed to access to this route
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No token provided"
    });
  }
  // if exists, decode the token to obtain the id
  const decoded = jwt.verify(token, config.secret);

  // Return the user data (without the password) if exists in the DB
  const user = await User.findById(decoded.id, { password: 0 });
  if (!user) {
    return res.status(404).send("User not found");
  }

  res.json(user);
});

router.post("/signin", (req, res, next) => {
  res.json("signin");
});

module.exports = router;
