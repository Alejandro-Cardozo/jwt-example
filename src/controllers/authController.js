const { Router } = require("express");
const router = Router();

router.post("/signup", (req, res, next) => {
  res.json("signup");
});

router.post("/signin", (req, res, next) => {
  res.json("signin");
});

router.get("/profile", (req, res, next) => {
  res.json("profile");
});

module.exports = router;
