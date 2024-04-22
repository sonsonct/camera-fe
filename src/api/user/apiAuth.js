const axios = require("axios");
require("dotenv").config();

const handleRegister = async (req, res) => {
  try {
    console.log("bd h", req.body);
    let data = await axios.post(process.env.BASE_URL + `user/auth/register`, {
      email: req.body.email,
      newPassword: req.body.password,
      reTypeNewPassword: req.body.reTypePassword,
    });
    console.log("bd2 h", data.data);

    console.log(data.data.success);
    if (data.data.statusCode === 200) {
      let erro = req.flash("erro");
      let success = req.flash("success");
      const email = req.body.email;
      const otpSignature = data.data.data.otpSignature;
      const newPassword = req.body.password;
      return res.render("user/veryOtp.ejs", {
        erro,
        success,
        email,
        otpSignature,
        newPassword,
      });
    }
  } catch (error) {
    console.log(error.response.data.message);
    if (error) {
      req.flash("erro", `${error.response.data.message}`);
    }
    return res.redirect("/register");
  }
};

const handleVertifiOtp = async (req, res) => {
  try {
    console.log("bd", req.body.newPassword);
    let data = await axios.post(
      process.env.BASE_URL + `user/auth/verify-otp-register`,
      {
        otpSignature: req.body.otpSignature,
        email: req.body.email,
        otpCode: req.body.otpCode,
      }
    );
    // console.log("bd2", data.data);

    // console.log(data.data.success);
    if (data.data.statusCode === 200) {
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error.response.data.message.message);
    if (error) {
      req.flash("erro", `${error.response.data.message.message}`);
    }
    let erro = req.flash("erro");
    let success = req.flash("success");
    const email = req.body.email;
    const otpSignature = req.body.otpSignature;
    return res.render("user/veryOtp.ejs", {
      erro,
      success,
      email,
      otpSignature,
      newPassword: req.body.password,
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    //console.log(req.body.email);
    let data = await axios.post(process.env.BASE_URL + `user/auth/login`, {
      email: req.body.email,
      password: req.body.password,
    });
    console.log(data.data.data.accessToken);

    if (data.data.statusCode !== 200) {
      req.flash("erro", `${data.data.message}`);
    }

    if (data.data.statusCode == 200) {
      req.flash("success", `${data.data.message}`);
      res.cookie("token", data.data.data.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(error.response.data.message);
    if (error.response.data.message) {
      req.flash("erro", `${error.response.data.message}`);
    }
    return res.redirect("/login");
  }
};

const handleLoginFB = async (req, res) => {
  try {
    //console.log(req["user"]);
    let data = await axios.post(process.env.BASE_URL + `user/auth/faceboock`, {
      dataUser: req["user"],
    });

    console.log(data.data);
    if (data.data.statusCode !== 200) {
      req.flash("erro", `${data.data.message}`);
    }

    console.log(data.data.data.accessToken);

    if (data.data.statusCode == 200) {
      req.flash("success", `${data.data.message}`);
      res.cookie("token", data.data.data.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(error.response.data.message);
    if (error.response.data.message) {
      req.flash("erro", `${error.response.data.message}`);
    }
    return res.redirect("/login");
  }
};

const handleLoginGG = async (req, res) => {
  try {
    console.log(req["user"]);
    return;
    let data = await axios.post(process.env.BASE_URL + `user/auth/faceboock`, {
      dataUser: req["user"],
    });

    console.log(data.data);
    if (data.data.statusCode !== 200) {
      req.flash("erro", `${data.data.message}`);
    }

    console.log(data.data.data.accessToken);

    if (data.data.statusCode == 200) {
      req.flash("success", `${data.data.message}`);
      res.cookie("token", data.data.data.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.redirect("/login");
  } catch (error) {
    console.log(error.response.data.message);
    if (error.response.data.message) {
      req.flash("erro", `${error.response.data.message}`);
    }
    return res.redirect("/login");
  }
};

const handleAuth = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let data = await axios.get(process.env.BASE_URL + `account/myAccount`, {
      headers,
    });
    //console.log(data.data.statusCode);
    if (data.data.statusCode == 200) {
      return data.data.data;
    }
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

const getUserLogin = async (req, res) => {
  try {
    let token = req.cookies.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let data = await axios.get(process.env.BASE_URL + `account/myAccount`, {
      headers,
    });

    return res.render("user/myaccount.ejs", { user: data.data.data });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleAuth,
  getUserLogin,
  handleVertifiOtp,
  handleLoginFB,
  handleLoginGG,
};
