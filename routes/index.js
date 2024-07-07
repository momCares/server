const express = require("express");
const router = express.Router();
const { authentication, authorization } = require("../middlewares/auth");

// WEB
const authRoute = require("./authRoute");
const addressRoute = require("./addressRoute");
const cartRoute = require("./cartRoute");
const categoryRoute = require("./categoryRoute");
const cityRoute = require("./cityRoute");
const orderRoute = require("./orderRoute");
const productRoute = require("./productRoute");
const promoRoute = require("./promoRoute");
const provinceRoute = require("./provinceRoute");
const storeRoute = require("./storeRoute");
const userRoute = require("./userRoute");

// CMS
const authRouteCMS = require("./cms/authRoute");
const categoryRouteCMS = require("./cms/categoryRoute");
const orderRouteCMS = require("./cms/orderRoute");
const productRouteCMS = require("./cms/productRoute");
const promoRouteCMS = require("./cms/promoRoute");
const storeRouteCMS = require("./cms/storeRoute");

const PREFIX = "/v1/api";

router.use(`${PREFIX}/auth`, authRoute);
router.use(`${PREFIX}/products`, productRoute);
router.use(authentication);
router.use(`${PREFIX}/address`, addressRoute);
router.use(`${PREFIX}/carts`, cartRoute);
router.use(`${PREFIX}/categories`, categoryRoute);
router.use(`${PREFIX}/cities`, cityRoute);
router.use(`${PREFIX}/orders`, orderRoute);
router.use(`${PREFIX}/promo`, promoRoute);
router.use(`${PREFIX}/provinces`, provinceRoute);
router.use(`${PREFIX}/stores`, storeRoute);
router.use(`${PREFIX}/users`, userRoute);

router.use(`${PREFIX}/cms/auth`, authRouteCMS);
router.use(`${PREFIX}/cms/categories`, categoryRouteCMS);
router.use(`${PREFIX}/cms/orders`, orderRouteCMS);
router.use(`${PREFIX}/cms/products`, productRouteCMS);
router.use(`${PREFIX}/cms/promo`, promoRouteCMS);
router.use(`${PREFIX}/cms/stores`, storeRouteCMS);

module.exports = router;
