const axios = require("axios");
require("dotenv").config();

const handleRegister = async (req, res) => {
  try {
    console.log("bd", req.body);
    let data = await axios.post(process.env.BASE_URL + `user/auth/register`, {
      email: req.body.email,
      newPassword: req.body.password,
      reTypeNewPassword: req.body.reTypePassword,
    });
    console.log("bd2", data.data);

    console.log(data.data.success);
    if (data.data.statusCode === 200) {
      return res.render("/register");
    }
  } catch (error) {
    console.log(error.response.data.message);
    if (error) {
      req.flash("erro", `${error.response.data.message}`);
    }
    return res.redirect("/register");
  }
};

const handleLogin = async (req, res) => {
  try {
    let data = await axios.post(process.env.BASE_URL + `login`, req.body);
    if (data.data.success == true) {
      console.log(data.data);
      req.flash("success", `${data.data.message}`);
      res.cookie("UserId", data.data.user.id, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("token", data.data.token, {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.redirect("/login");
  } catch (error) {
    //console.log(error.response.data.message);
    if (error.response.data.detail) {
      req.flash("erro", `${error.response.data.message}`);
    }
    return res.redirect("/login");
  }
};

const handleAuth = async (token) => {
  try {
    let data = await axios.get(process.env.BASE_URL + `authenticate/${token}`);
    if (data.data.success == true) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

const getUserLogin = async (req, res) => {
  try {
    let user_id = req.params.id;
    let get_user = await axios.get(process.env.BASE_URL + `users/${user_id}`);
    res.cookie("name", get_user.data.name, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("username", get_user.data.username, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("email", get_user.data.email, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("address", get_user.data.address, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.render("user/myaccount.ejs", { user: get_user.data });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleAuth,
  getUserLogin,
};
