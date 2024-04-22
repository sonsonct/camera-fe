const multer = require("multer");

var storage = multer.diskStorage({
  // destination: (req, file, res) => {
  //     res(null, './src/public/images/products')
  // },
  filename: (req, file, res) => {
    res(null, file.originalname);
    console.log(file);
  },
});
var upload = multer({ storage: storage });
module.exports = upload;
