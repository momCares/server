const express = require("express");
const router = express.Router();
const storeController = require("../../controllers/cms/storeController");
const { authorization } = require("../../middlewares/auth");

router.get("/", authorization(["admin"]), storeController.findAll);
router.get("/:id", authorization(["admin"]), storeController.findOne);
router.post("/", authorization(["admin"]), storeController.create);
router.put("/:id", authorization(["admin"]), storeController.update);
router.delete("/:id", authorization(["admin"]), storeController.destroy);

module.exports = router;