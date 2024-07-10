const express = require("express");
const userController = require("../controllers/userController");
const { authentication, authorization } = require("../middlewares/auth");

const router = express.Router();

router.put(
  "/:id",
  authentication,
  authorization(["admin", "user"]),
  userController.updateUser
);
router.get(
  "/:id",
  authentication,
  authorization(["admin", "user"]),
  userController.getUserById
);

module.exports = router;
