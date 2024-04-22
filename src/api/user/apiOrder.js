const axios = require("axios");
require("dotenv").config();
const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", // sandbox hoặc live
  client_id:
    "AeQvA6fwEKOk-LQnBTE7bizy3f61pTUmW2toGMLXes6R2tjtgve-KNry9wtQ1qwHhJtVstUIGXMY-I65",
  client_secret:
    "ECodx2IsIHMPz66SNFamm-PST85rozqFaG178bqE01ILfkrT0w0M0j09FC7vO313eNg0JKI6iH131287",
});
const createPayment = (req, res, data) => {
  //console.log(data);
  let sumPrice = 0;
  data.forEach((order) => {
    sumPrice +=
      order.total * order.product.price -
      (order.total * order.product.price * order.product.sale) / 100;
  });

  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8082/success",
      cancel_url: "http://localhost:8082/cancel",
    },
    transactions: [
      {
        item_list: {
          items: data.map((items) => {
            return {
              name: items.product.productName,
              price: (
                items.product.price -
                (items.product.price * items.product.sale) / 100
              ).toFixed(2),
              currency: "USD",
              quantity: items.total,
            };
          }),
        },
        amount: {
          currency: "USD",
          total: sumPrice.toFixed(2),
        },
        description: "Description of the payment",
      },
    ],
  };

  paypal.payment.create(paymentData, function (error, payment) {
    if (error) {
      console.error(error);
    } else {
      // Redirect người dùng đến URL thanh toán PayPal
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

const cancelPayment = async (req, res) => {
  const ship = await axios.get(
    process.env.BASE_URL + `cart/ship/${req.cookies.userId}`
  );
  res.render("user/paymentComplate.ejs", {
    status: false,
    order: ship.data.data[0],
  });
};
// Xử lý callback từ PayPal sau khi thanh toán hoàn tất

const executePayment = async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const executePaymentData = {
    payer_id: payerId,
  };
  const ship = await axios.get(
    process.env.BASE_URL + `cart/ship/${req.cookies.userId}`
  );

  await axios.put(process.env.BASE_URL + `cart/ship/${ship.data.data[0].id}`);

  paypal.payment.execute(
    paymentId,
    executePaymentData,
    function (error, payment) {
      if (error) {
        console.error(error);
      } else {
        res.render("user/paymentComplate.ejs", {
          status: true,
          order: ship.data.data[0],
        });
      }
    }
  );
};
const order = async (req, res) => {
  try {
    let erro = req.flash("erro");
    console.log(req.body);
    if (req.body.name == "") {
      erro = "Vui lòng nhập tên người nhận";
    }
    if (req.body.phone == "") {
      erro = "Vui lòng nhập số điện thoại người nhận";
    }
    if (req.body.address == "") {
      erro = "Vui lòng nhập địa chỉ người nhận";
    }

    const carts = await axios.get(
      process.env.BASE_URL + `cart/${req.cookies.userId}`
    );
    const data = carts.data.data[0].orders;
    let sumPrice = 0;
    carts.data.data[0].orders.forEach((element) => {
      sumPrice =
        sumPrice +
        (element.total * element.product.price -
          (element.total * element.product.price * element.product.sale) / 100);
    });

    if (erro.length > 0) {
      return res.render("user/cart.ejs", {
        carts: data,
        sumPrice: sumPrice,
        erro,
      });
    }

    await axios.post(process.env.BASE_URL + `cart/ship`, {
      phoneNumber: req.body.phone,
      nameUser: req.body.name,
      address: req.body.address,
      cartId: carts.data.data[0].id,
    });

    return createPayment(req, res, data);
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
  executePayment,
  createPayment,
  cancelPayment,
};
