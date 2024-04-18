const express = require("express");
const router = express.Router();
const apiAuth = require("../api/user/apiAuth");
const apiProduct = require("../api/user/apiProduct");
const middleware = require("../middleware/middleware");
const store = require("../store/cart");
const apiOrder = require("../api/user/apiOrder");
const apiRate = require("../api/user/apiRate");
const apiCategory = require("../api/user/apiCategory");

router.get("/", apiProduct.getProductHome1);
router.get("/login", middleware.checkAuth);
router.post("/login", apiAuth.handleLogin);

router.get("/register", (req, res) => {
  let erro = req.flash("erro");
  let success = req.flash("success");
  return res.render("user/register.ejs", { success, erro });
});

router.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.cookie("UserId", "", { maxAge: 0 });
  res.cookie("name", "", { maxAge: 0 });
  res.cookie("email", "", { maxAge: 0 });
  res.cookie("username", "", { maxAge: 0 });
  res.cookie("address", "", { maxAge: 0 });
  return res.redirect("/login");
});
router.post("/register", apiAuth.handleRegister);

router.get("/addCart/:id", store.handleAddCart);
router.get("/viewCart", (req, res) => {
  let erro = req.flash("erro");
  let success = req.flash("success");
  let carts = req.session.cart;
  let total = 0;
  let sum = 0;
  for (let i = 0; i < carts.length; i++) {
    sum = carts[i].price * carts[i].quantity;
    total += sum;
  }
  return res.render("user/cart.ejs", { carts, total, success, erro });
});
router.get("/deleteCart/:id", store.deleteCart);
router.get("/increaseCart/:id", store.upCart);
router.get("/decreaseCart/:id", store.deCart);

router.post("/order", middleware.checkRequireLogin, apiOrder.order);
router.get(
  "/orderConfirm/:UserId",
  middleware.checkRequireLogin,
  apiOrder.getOrderConfirm
);
router.get(
  "/orderShip/:UserId",
  middleware.checkRequireLogin,
  apiOrder.getOrderShip
);
router.get(
  "/orderComplete/:UserId",
  middleware.checkRequireLogin,
  apiOrder.getOrderComplete
);
router.get(
  "/updateStatusOrder/:orderId",
  middleware.checkRequireLogin,
  apiOrder.updateStatusOrder
);
router.get(
  "/rateOrder/user=:userId/order=:orderId",
  middleware.checkRequireLogin,
  apiOrder.getOrderRate
);
router.post(
  "/rateOrderAction",
  middleware.checkRequireLogin,
  apiRate.handleRate
);

router.get("/user/:id", middleware.checkRequireLogin, apiAuth.getUserLogin);
router.get("/search", apiProduct.getProductSearch);
router.get("/search/:page", apiProduct.getProductSearchPage);

router.get("/detail/:id", apiProduct.getProductDetail);
router.get("/categories", apiCategory.getCategory);
module.exports = router;
