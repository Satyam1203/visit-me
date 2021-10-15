const router = require("express").Router();

const userController = require("../controllers/user");
const storeController = require("../controllers/store");
const scheduleController = require("../controllers/schedule");
const authController = require("../controllers/auth");

const authenticate = require("../middlewares/auth");

router.route("/user").post(userController.create);
router.route("/user/find").post(userController.get);
router.route("/user/login").post(userController.login);

router.route("/store").post(storeController.create);
router.route("/store/find").post(storeController.get);
router.route("/store/find/").get(storeController.getAll);
router.route("/store/login").post(storeController.login);

router.route("/schedule").post(scheduleController.create);
router.route("/schedule/find/user").post(scheduleController.getByUser);
router.route("/schedule/find/date").post(scheduleController.getByDate);

router.use("/authenticate", authenticate, (req, res) => {
  res.json(req.user);
});
router.route("/logout").post(authController.logout);

module.exports = router;
