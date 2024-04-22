const apiProduct = require("../api/user/apiProduct");
const axios = require("axios");

const vietCart = async (req, res) => {
  let erro = req.flash("erro");
  const carts = await axios.get(
    process.env.BASE_URL + `cart/${req.cookies.userId}`
  );
  //console.log(carts.data.data[0].orders);
  let sumPrice = 0;
  let cartData = [];
  if (carts.data.data[0].orders) {
    cartData = carts.data.data[0].orders;
    carts.data.data[0].orders.forEach((element) => {
      sumPrice =
        sumPrice +
        (element.total * element.product.price -
          (element.total * element.product.price * element.product.sale) / 100);
    });
  }
  console.log(cartData);

  return res.render("user/cart.ejs", {
    carts: cartData,
    sumPrice: sumPrice,
    erro,
  });
};

const handleAddCart = async (req, res) => {
  await axios.post(process.env.BASE_URL + `cart`, {
    userId: req.cookies.userId,
    productId: [req.params.id],
  });

  return res.redirect("/");
};

const deleteCart = async (req, res) => {
  let orderId = req.params.id;
  await axios.delete(process.env.BASE_URL + `cart/${orderId}`);
  return res.redirect("/viewCart");
};

const upCart = async (req, res) => {
  let orderId = req.params.id;
  const order = await axios.get(process.env.BASE_URL + `cart/order/${orderId}`);
  //console.log(order.data.data);
  await axios.put(process.env.BASE_URL + `cart/order/${orderId}`, {
    total: 1,
  });
  return res.redirect("/viewCart");
};

const deCart = async (req, res) => {
  let orderId = req.params.id;
  const order = await axios.get(process.env.BASE_URL + `cart/order/${orderId}`);
  //console.log(order.data.data);
  await axios.put(process.env.BASE_URL + `cart/order/${orderId}`, {
    total: -1,
  });
  return res.redirect("/viewCart");
};

module.exports = {
  handleAddCart,
  deleteCart,
  upCart,
  deCart,
  vietCart,
};
