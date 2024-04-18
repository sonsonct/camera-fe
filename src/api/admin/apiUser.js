const axios = require("axios");
require("dotenv").config();
const getUserHome = async (req, res) => {
    try {
        let dataUser = await axios.get(process.env.BASE_URL + `user/limit/1`);
        let countUser = await axios.get(process.env.BASE_URL + `countUser`);
        //console.log("Data:", dataUser.data);
        let data = dataUser.data.users
        return res.render("admin/userAdmin.ejs", {
            dataUser: data,
            countUser: countUser.data.data
        });
    } catch (error) {
        console.log(error);
    }
};
const getUserByUserName = async (req, res) => {
    try {
        let userName = req.body.username
        console.log("a", req.body.username)
        if (userName == "") {
            return res.render('success.ejs', { message: "Vui lòng nhập tên người dùng", url: '/admin/user/' })
        }
        // console.log(userName)
        let dataUser = await axios.get(process.env.BASE_URL + `userByUserName/${userName}`);
        console.log("Data tim kirm:", dataUser.data.user);
        let data = dataUser.data.user
        //console.log("Data tim kirm:", dataUser.data.success);
        if (dataUser.data.success === false) {
            return res.render("admin/userAdmin.ejs", {
                message: `không tìn thấy người dùng có username: ${userName}`,
                nameSearch: userName,

            });
        }
        return res.render("admin/userAdmin.ejs", {
            dataUser: data,
            nameSearch: userName,
            countUser: dataUser.data.user.length
        });
    } catch (error) {
        console.log(error);
    }
};
const getUserByUserNamePage = async (req, res) => {
    try {
        let name = req.params.username;
        console.log(name)
        if (name == "") {
            return res.render('success.ejs', { message: "Vui lòng nhập tên người dùng", url: '/admin/user/' })
        }
        let currentPage = req.params.currentPage;
        console.log(name)

        let data = await axios.get(
            process.env.BASE_URL + `userByUserNamePage/${name}/page/${currentPage}`
        );
        let data2 = await axios.get(
            process.env.BASE_URL + `userByUserName/${name}`
        );
        console.log('len', data.data)
        if (data.data.success !== false) {
            let dataUser = data.data.user;

            console.log("a", name);
            return res.render("admin/userAdmin.ejs", {
                dataUser: dataUser,
                nameSearch: name,
                countProducts: data2.data.user.length,
            });
        } else {
            return res.render("admin/userAdmin.ejs", {
                message: `không tìm thấy người dùng có username: ${name}`,
                nameSearch: name,
            });
        }

    } catch (error) {
        console.log("Error:", error);
    }
};
const deleteUser = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id)
        let data = await axios.delete(process.env.BASE_URL + `deleteUser/${id}`);
        if (data.data.success !== false) {
            return res.render('success.ejs', { message: "xóa người dùng thành công", url: '/admin/user/' })
        } else {
            return res.render('success.ejs', { message: "xóa người dùng thất bại", url: '/admin/user/' })
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
        Role = getRole.data.role
        data = dataUser.data.user
        // console.log(dataUser.data)
        // console.log(getRole.data)
        return res.render("admin/editUser.ejs", { dataUser: data, Role: Role })

    } catch (error) {
        console.log("Error:", error);
    }
}
const UpdateUser = async (req, res) => {
    try {

        const id = req.body.id
        console.log(id)
        let dataUser = await axios.put(process.env.BASE_URL + `updateUser/${id}`, req.body);
        //console.log(dataUser.data.dataUser)
        if (dataUser.data.success !== false) {
            return res.render('success.ejs', { message: "sửa thông tin người dùng thành công", url: `/admin/user/update/${req.body.id}` })
        } else {
            return res.render('success.ejs', { message: "sửa thông tin người dùng thất bại", url: `/admin/user/update/${req.body.id}` })
        }


    } catch (error) {
        console.log("Error:", error);
    }
}
const paginationUser = async (req, res) => {
    try {
        let currentPage = req.params.currentPage;
        let countUser = await axios.get(process.env.BASE_URL + `countUser`);
        let dataUser = await axios.get(process.env.BASE_URL + `user/limit/${currentPage}`);
        let data = dataUser.data.users
        return res.render("admin/userAdmin.ejs", {
            dataUser: data,
            countUser: countUser.data.data
        });

    } catch (error) {
        console.log("Error:", error);
    }
}
module.exports = {
    getUserHome,
    deleteUser,
    getUserByUserName,
    getUpdateUser,
    UpdateUser,
    paginationUser,
    getUserByUserNamePage
}