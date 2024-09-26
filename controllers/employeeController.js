const { Employee } = require("../models/employeeModel");
const { Store } = require("../models/storeModel");

// Thêm nhân viên
exports.add_employee = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      address,
      userRole,
      id_store,
    } = req.body;
    let image = "";

    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/public/uploads/${
        req.file.filename
      }`;
    }

    // Kiểm tra nếu email đã tồn tại
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    // Kiểm tra nếu cửa hàng có tồn tại
    if (id_store) {
      const store = await Store.findById(id_store);
      if (!store) {
        return res.status(400).json({ msg: "Cửa hàng không tồn tại" });
      }
    }

    const employee = new Employee({
      fullName,
      email,
      password,
      phoneNumber,
      address,
      image,
      userRole,
      id_store,
    });
    const result = await employee.save();
    await result.populate('id_store');
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
    console.log(error);
    
  }
};

// Cập nhật thông tin nhân viên
exports.update_employee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phoneNumber, address, userRole, id_store } =
      req.body;

    // Kiểm tra nhân viên có tồn tại không
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ msg: "Nhân viên không tồn tại" });
    }

    // Kiểm tra nếu email đã tồn tại (ngoại trừ nhân viên hiện tại)
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee && existingEmployee._id.toString() !== id) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    // Kiểm tra nếu cửa hàng có tồn tại
    if (id_store) {
      const store = await Store.findById(id_store);
      if (!store) {
        return res.status(400).json({ msg: "Cửa hàng không tồn tại" });
      }
    }

    employee.fullName = fullName;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.address = address;
    employee.id_store = id_store;
    employee.userRole = userRole;

    // Cập nhật ảnh nếu có file mới
    if (req.file) {
      employee.image = `${req.protocol}://${req.get("host")}/public/uploads/${
        req.file.filename
      }`;
    }

    const result = await employee.save();
    await result.populate('id_store').execPopulate();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Xóa nhân viên
exports.delete_employee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ msg: "Nhân viên không tồn tại" });
    }

    res.status(200).json({ msg: "Đã xóa nhân viên" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Lấy danh sách nhân viên
exports.get_list_employee = async (req, res, next) => {
  try {
    const employees = await Employee.find()
      .sort({ createdAt: -1 })
      .populate("id_store");

    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
