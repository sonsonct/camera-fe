const axios = require("axios");
require("dotenv").config();
const getUserHome = async (req, res) => {
  try {
    const token = req.cookies.jwtadmin;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let dataUser = await axios.get(
      process.env.BASE_URL + `user?page=1&pageSize=6`,
      { headers }
    );

    // console.log("Data:", dataUser.data.data);
    // let data = dataUser.data.data.data;
    // return;

    return res.render("admin/userAdmin.ejs", {
      dataUser: dataUser.data.data.data,
      countUser: dataUser.data.data.totalItem,
    });
  } catch (error) {
    console.log(error);
  }
};
const getUserByUserName = async (req, res) => {
  try {
    const token = req.cookies.jwtadmin;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let userName = req.body.username;
    console.log("a", req.body.username);
    if (userName == "") {
      return res.render("success.ejs", {
        message: "Vui lòng nhập tên người dùng",
        url: "/admin/user/",
      });
    }
    // console.log(userName)
    let dataUser = await axios.get(
      process.env.BASE_URL + `user?page=1&pageSize=6&searchKey=${userName}`,
      { headers }
    );
    //console.log("Data tim kirm:", dataUser.data.data);

    if (dataUser.data.data.totalItem == 0) {
      return res.render("admin/userAdmin.ejs", {
        message: `không tìm thấy người dùng có username: ${userName}`,
        nameSearch: userName,
      });
    }
    return res.render("admin/userAdmin.ejs", {
      dataUser: dataUser.data.data.data,
      nameSearch: userName,
      countUser: dataUser.data.data.totalItem,
    });
  } catch (error) {
    console.log(error);
  }
};
const getUserByUserNamePage = async (req, res) => {
  try {
    let currentPage = req.params.currentPage;

    const token = req.cookies.jwtadmin;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let userName = req.params.username;
    // console.log("a", req.params.username);
    if (userName == "") {
      return res.render("success.ejs", {
        message: "Vui lòng nhập tên người dùng",
        url: "/admin/user/",
      });
    }
    // console.log(userName)
    //console.log(currentPage);
    let dataUser = await axios.get(
      process.env.BASE_URL +
        `user?page=${currentPage}&pageSize=6&searchKey=${userName}`,
      { headers }
    );
    //console.log("Data tim kirm:", dataUser.data.data);

    // if (dataUser.data.data.totalItem == 0) {
    //   return res.render("admin/userAdmin.ejs", {
    //     message: `không tìm thấy người dùng có username: ${userName}`,
    //     nameSearch: userName,
    //   });
    // }
    return res.render("admin/userAdmin.ejs", {
      dataUser: dataUser.data.data.data,
      nameSearch: userName,
      countUser: dataUser.data.data.totalItem,
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;

    const token = req.cookies.jwtadmin;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let data = await axios.delete(process.env.BASE_URL + `user/${id}`, {
      headers,
    });
    if (data.data.statusCode == 200) {
      return res.render("success.ejs", {
        message: "xóa người dùng thành công",
        url: "/admin/user/",
      });
    } else {
      return res.render("success.ejs", {
        message: "xóa người dùng thất bại",
        url: "/admin/user/",
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const getUpdateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let dataUser = await axios.get(process.env.BASE_URL + `user/${id}`);
    let getRole = await axios.get(process.env.BASE_URL + `getAllRole`);
    Role = getRole.data.role;
    data = dataUser.data.user;
    // console.log(dataUser.data)
    // console.log(getRole.data)
    return res.render("admin/editUser.ejs", { dataUser: data, Role: Role });
  } catch (error) {
    console.log("Error:", error);
  }
};
const UpdateUser = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    let dataUser = await axios.put(
      process.env.BASE_URL + `updateUser/${id}`,
      req.body
    );
    //console.log(dataUser.data.dataUser)
    if (dataUser.data.success !== false) {
      return res.render("success.ejs", {
        message: "sửa thông tin người dùng thành công",
        url: `/admin/user/update/${req.body.id}`,
      });
    } else {
      return res.render("success.ejs", {
        message: "sửa thông tin người dùng thất bại",
        url: `/admin/user/update/${req.body.id}`,
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const paginationUser = async (req, res) => {
  try {
    const token = req.cookies.jwtadmin;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let currentPage = req.params.currentPage;
    let dataUser = await axios.get(
      process.env.BASE_URL + `user?page=${currentPage}&pageSize=6`,
      { headers }
    );
    return res.render("admin/userAdmin.ejs", {
      dataUser: dataUser.data.data.data,
      countUser: dataUser.data.data.totalItem,
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
module.exports = {
  getUserHome,
  deleteUser,
  getUserByUserName,
  getUpdateUser,
  UpdateUser,
  paginationUser,
  getUserByUserNamePage,
};
