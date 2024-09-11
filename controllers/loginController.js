const { Employee } = require("../models/employeeModel");
const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Employee.findOne({ email, password }).select(
        "-password"
      );
      if (user) {
        const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });
  
        const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
          expiresIn: "1d",
        });
  
        res.json({
          status: 200,
          messenger: "Đăng nhập thành công",
          data: user,
          token: token,
          refreshToken: refreshToken,
        });
      } else {
        res.json({
          status: 400,
          messenger: "Tài khoản hoặc mật khẩu không chính xác!",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };