const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/cms/categoryController");
const { authorization } = require("../../middlewares/auth");

router.get("/", authorization(["admin"]), categoryController.findAll);
router.get("/:id", authorization(["admin"]), categoryController.findOne);
router.post("/", authorization(["admin"]), categoryController.create);
router.put("/:id", authorization(["admin"]), categoryController.update);
router.delete("/:id", authorization(["admin"]), categoryController.destroy);
router.post(
  "/restore/:id",
  authorization(["admin"]),
  categoryController.restore
);

module.exports = router;
