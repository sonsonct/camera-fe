const axios = require("axios");
require("dotenv").config();
const order = async (req, res) => {
  try {
    if (!req.body.method) {
      req.body.method = "";
    }
    let dataOrder = {
      user: req.body,
      cart: req.session.cart,
    };
    console.log("Data:", dataOrder);
    let data = await axios.post(process.env.BASE_URL + `order`, dataOrder);
    if (data.data.success == true) {
      req.session.cart = null;
      req.flash("success", `${data.data.message}`);
    }
    console.log(data.data);
    return res.redirect("/viewCart");
  } catch (error) {
    console.log("Loi:", error.response.data.detail);
    if (error.response.data.detail) {
      req.flash("erro", `${error.response.data.detail}`);
    }
    return res.redirect("/viewCart");
  }
};

const getOrderConfirm = async (req, res) => {
  try {
    let UserId = req.params.UserId;
    let data = await axios.get(process.env.BASE_URL + `orderConfirm/${UserId}`);
    if (data.data.success !== false) {
      return res.render("user/order_wait.ejs", {
        orders: data.data.order,
        lastProduct: data.data.last_product,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getOrderShip = async (req, res) => {
  try {
    let UserId = req.params.UserId;
    let data = await axios.get(process.env.BASE_URL + `orderShip/${UserId}`);
    if (data.data.success !== false) {
      return res.render("user/order_ship.ejs", {
        orders: data.data.order,
        lastProduct: data.data.last_product,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getOrderComplete = async (req, res) => {
  try {
    let UserId = req.params.UserId;
    let data = await axios.get(
      process.env.BASE_URL + `orderComplete/${UserId}`
    );
    if (data.data.success !== false) {
      return res.render("user/order_complete.ejs", {
        orders: data.data.order,
        lastProduct: data.data.last_product,
        countCheck: data.data.check_rate,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getOrderRate = async (req, res) => {
  try {
    let erro = req.flash("erro");
    let userId = req.params.userId;
    let orderId = req.params.orderId;
    let data = await axios.get(
      process.env.BASE_URL + `orderRate/${userId}/${orderId}`
    );
    if (data.data.success === true) {
      return res.render("user/rate.ejs", {
        orders: data.data.order,
        checkRated: data.data.get_rate,
        countCheck: data.data.check_count_rate,
        erro,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    let userId = req.cookies.UserId;
    let orderId = req.params.orderId;
    let data = await axios.get(
      process.env.BASE_URL + `updateStatusOrder/${orderId}`
    );
    if (data.data.success === true) {
      return res.redirect(`/orderShip/${userId}`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  order,
  getOrderConfirm,
  getOrderShip,
  getOrderComplete,
  getOrderRate,
  updateStatusOrder,
};
