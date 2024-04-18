const express = require("express");
const router = express.Router();
const apiAdmin = require("../api/admin/apiAdmin");
const apiUser = require("../api/admin/apiUser");
const apiProduct = require("../api/admin/apiProduct");
const apiSale = require("../api/admin/apiSale");

const apiOrderManagement = require("../api/admin/apiOrderManagement");
const upload = require("../middleware/UploadImg");
const middleware = require("../middleware/middleware");
// admin
router.get("/loginAdmin", apiAdmin.loginAdmin);
router.post("/loginAdmin", apiAdmin.handleLoginAdmin);
router.get("/logoutAdmin", (req, res) => {
  res.cookie("jwtadmin", "", { maxAge: 0 });
  res.cookie("adminUserId", "", { maxAge: 0 });
  res.cookie("adminname", "", { maxAge: 0 });
  res.cookie("adminemail", "", { maxAge: 0 });
  res.cookie("adminusername", "", { maxAge: 0 });
  res.cookie("adminaddress", "", { maxAge: 0 });
  return res.redirect("/loginAdmin");
});
router.get("/admin", apiAdmin.getHome);

//product
router.get(
  "/admin/product",
  middleware.checkPremission,
  apiProduct.getProductHome2
);
router.get(
  "/admin/product/page/:currentPage",
  middleware.checkPremission,
  apiProduct.getProductHome
);
router.get(
  "/admin/product/edit/:id",
  middleware.checkPremission,
  apiProduct.getProductDetail
);
router.post(
  "/admin/product/edit",
  middleware.checkPremission,
  upload.single("image"),
  apiProduct.updateProduct
);
router.get(
  "/admin/product/delete/:id",
  middleware.checkPremission,
  apiProduct.deleteProduct
);
router.post(
  "/admin/product",
  middleware.checkPremission,
  apiProduct.getProductByName
);
router.get(
  "/admin/product/:name/page/:currentPage",
  middleware.checkPremission,
  apiProduct.getProductByNamePage
);
router.get(
  "/admin/product/create",
  middleware.checkPremission,
  apiProduct.getCreateProduct
);
router.post(
  "/admin/product/create",
  upload.single("image"),
  middleware.checkPremission,
  apiProduct.createProduct
);

//user
router.get("/admin/user", middleware.checkPremission, apiUser.getUserHome);
router.get(
  "/admin/user/page/:currentPage",
  middleware.checkPremission,
  apiUser.paginationUser
);
router.post(
  "/admin/user/",
  middleware.checkPremission,
  apiUser.getUserByUserName
);
router.get(
  "/admin/user/:username/page/:currentPage",
  middleware.checkPremission,
  apiUser.getUserByUserNamePage
);
router.get(
  "/admin/user/update/:id",
  middleware.checkPremission,
  apiUser.getUpdateUser
);
router.post(
  "/admin/user/update",
  middleware.checkPremission,
  apiUser.UpdateUser
);
router.get(
  "/admin/user/delete/:id",
  middleware.checkPremission,
  apiUser.deleteUser
);

//order
router.get(
  "/admin/order",
  middleware.checkPremission,
  apiOrderManagement.getOrderHome
);
router.get(
  "/admin/order/confirm/:orderId",
  middleware.checkPremission,
  apiOrderManagement.confirmOrder
);
router.get(
  "/admin/order/delete/:orderId",
  middleware.checkPremission,
  apiOrderManagement.deleteOrder
);
router.get(
  "/admin/order/page/:currentPage",
  middleware.checkPremission,
  apiOrderManagement.paginationOrder
);

//sale
router.get("/admin/sale", middleware.checkPremission, apiSale.getHomeSale);
router.get(
  "/admin/sale/page/:currentPage",
  middleware.checkPremission,
  apiSale.getSalePage
);
router.post(
  "/admin/addSale",
  middleware.checkPremission,
  apiSale.addProductSale
);
router.get(
  "/admin/deleteSale/:product_id",
  middleware.checkPremission,
  apiSale.deleteProduct
);
router.post(
  "/admin/updateSale",
  middleware.checkPremission,
  apiSale.updateDiscount
);

module.exports = router;
