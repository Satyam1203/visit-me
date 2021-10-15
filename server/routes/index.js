const router = require("express").Router();

const userController = require("../controllers/user");
const storeController = require("../controllers/store");
const authController = require("../controllers/auth");

const authenticate = require("../middlewares/auth");

router.route("/user").post(userController.create);
router.route("/user/find").post(userController.get);
router.route("/user/login").post(userController.login);

router.route("/store").post(storeController.create);
router.route("/store/find").post(storeController.get);
router.route("/store/login").post(storeController.login);

router.use("/authenticate", authenticate, (req, res) => {
  res.json(req.user);
});
router.route("/logout").post(authController.logout);

module.exports = router;
