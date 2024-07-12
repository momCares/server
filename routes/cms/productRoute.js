const express = require("express");
const router = express.Router();
const productController = require("../../controllers/cms/productController");
const upload = require("../../middlewares/multer");
const { authorization } = require("../../middlewares/auth");

router.get("/", authorization(["admin"]), productController.findAll);
router.get("/:slug", authorization(["admin"]), productController.findOne);
router.post("/", authorization(["admin"]), productController.create);
router.put("/:id", authorization(["admin"]), productController.update);
router.delete("/:id", authorization(["admin"]), productController.destroy);
router.post(
  "/uploads",
  authorization(["admin"]),
  upload.single("image"),
  productController.uploadImage
);
router.post(
  "/restore/:id",
  authorization(["admin"]),
  productController.restore
);

module.exports = router;
