const express = require("express");
const userController = require("../controllers/userController");
const { authentication, authorization } = require("../middlewares/auth");

const router = express.Router();

// router.put("/:id", authentication, authorization, userController.updateUser);
// router.get("/:id", authentication, authorization, userController.getUserById);

router.put("/:id", userController.updateUser);
router.get("/:id", userController.getUserById);

module.exports = router;
