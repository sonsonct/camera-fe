const axios = require("axios");
const jwt = require("jsonwebtoken");

require("dotenv").config();
function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
const createJWT = (payload) => {
  let token = null;
  let key = process.env.JWT_SECRET;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  let decoded = null;
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};
const getHome = async (req, res) => {
  try {
    let Statistics = await axios.get(process.env.BASE_URL + `getStatistics`);
    // let statisticsByMonht = await axios.get(process.env.BASE_URL + `getStatisticsByMonth`);
    // let statisticsByYear = await axios.get(process.env.BASE_URL + `getStatisticsByYear`);
    // let order_productDesc = await axios.get(process.env.BASE_URL + `getTopProductSale`);
    // let categoriesSale = await axios.get(process.env.BASE_URL + `getProductCategory`);
    // let productAllRate = await axios.get(process.env.BASE_URL + `getProductRate`);
    let product = await axios.get(process.env.BASE_URL + `getProductAdmin`);
    let expired = await axios.get(process.env.BASE_URL + `expired`);
    //let countAllRate = await axios.get(process.env.BASE_URL + `countRate`);
    //console.log("rate:", expired.data.product);
    const Monht = formatVND(
      Statistics.data.StatisticsByMonth.StatisticsByMonth
    );
    const Year = formatVND(Statistics.data.StatisticsByYear.total_revenue);
    //console.log(categoriesSale.data.product)
    //console.log(productAllRate.data)
    return res.render("admin/indexAdmin.ejs", {
      Statistics: Statistics.data.Statistics,
      statisticsByMonht: Monht,
      statisticsByYear: Year,
      order_productDesc: product.data.getTopProductSale,
      categoriesSale: product.data.getProductCategory,
      countAllRate: Statistics.data.countrate,
      productAllRate: product.data.getProductRate,
      expired: expired.data.product,
      saleprd: expired.data.sale,
    });
  } catch (error) {
    console.log(error);
  }
};
const loginAdmin = async (req, res) => {
  //   let erro = req.flash("erro");
  //   return res.render("admin/loginAdmin.ejs", { erro });
  let cookie = req.cookies;
  let erro = req.flash("erro");
  console.log("cc", cookie.jwtadmin);
  if (cookie && cookie.jwtadmin) {
    let token = cookie.jwtadmin;
    let decoded = verifyToken(token);
    console.log(decoded);

    if (decoded) {
      res.cookie("adminUserId", decoded.id, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let getUser = await axios.get(
        process.env.BASE_URL + `account/myAccount/`,
        { headers }
      );
      console.log(getUser.data);

      res.cookie("adminname", getUser.data.data.username, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("email", getUser.data.data.email, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("avatar", getUser.data.data.avarta, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("role", decoded.role, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.redirect("/admin");
    } else {
      return res.render("admin/loginAdmin.ejs", { erro });
    }
  } else {
    return res.render("admin/loginAdmin.ejs", { erro });
  }
};
const handleLoginAdmin = async (req, res) => {
  try {
    //console.log("a", req.body);

    let data = await axios.post(process.env.BASE_URL + `admin/auth/login`, {
      email: "sondzvodoi@gmail.com",
      password: "string",
    });

    console.log(data.data.statusCode);
    if (data.data.statusCode !== 200) {
      req.flash("erro", `${data.data.message}`);
    } else {
      req.flash("success", `${data.data.message}`);

      res.cookie("jwtadmin", data.data.data.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    let cookie = req.cookies;
    console.log("a", cookie.jwtadmin);
    return res.redirect("/loginAdmin");
  } catch (error) {
    console.log(error);
    if (error) {
      req.flash("erro", `${error}`);
    }
    return res.redirect("/loginAdmin");
  }
};
module.exports = {
  getHome,
  loginAdmin,
  handleLoginAdmin,
};
