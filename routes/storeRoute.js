const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.findAllStores);
router.get("/:id", storeController.findStoreById);
router.post("/", storeController.createStore);
router.put("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);

module.exports = router;
