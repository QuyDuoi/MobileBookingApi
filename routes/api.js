const express = require("express");
const router = express.Router();
const {
  add_employee,
  update_employee,
  delete_employee,
  get_list_employee,
} = require("../controllers/employeeController");
const {
  add_category,
  update_category,
  delete_category,
  get_list_category,
} = require("../controllers/categoryController");
const {
  add_service,
  update_service,
  delete_service,
  get_list_service,
} = require("../controllers/serviceController");
const {
  add_store,
  update_store,
  delete_store,
  get_list_store,
} = require("../controllers/storeController");
const {
  add_booking, update_booking, delete_booking, get_bookings
} = require("../controllers/bookingsController");
const { add_product, update_product, delete_product, get_list_product } = require("../controllers/productController");
const { add_invoice, update_invoice, delete_invoice, get_list_invoice} = require("../controllers/invoiceController");
const {update_hours_store} = require("../controllers/storeHoursController");
const { login } = require("../controllers/loginController");

const upload = require("../config/upload");

// Restful Api Nhân viên
router.post("/addEmployee", upload.single("image"), add_employee);
router.put("/updateEmployee/:id", upload.single("image"), update_employee);
router.delete("/deleteEmployee/:id", delete_employee);
router.get("/getListEmployee", get_list_employee);

// Restful Api Danh mục
router.post("/addCategory", add_category);
router.put("/updateCategory/:id", update_category);
router.delete("/deleteCategory/:id", delete_category);
router.get("/getListCategory", get_list_category);

// Restful Api Dịch vụ
router.post("/addService", add_service);
router.put("/updateService/:id", update_service);
router.delete("/deleteService/:id", delete_service);
router.get("/getListService", get_list_service);

// Restful Api Cửa hàng
router.post("/addStore", upload.single("image"), add_store);
router.put("/updateStore/:id", upload.single("image"), update_store);
router.delete("/deleteStore/:id", delete_store);
router.get("/getListStore", get_list_store);
router.post("/searchStore")

// Restful Api Booking
router.post("/addBooking", add_booking);
router.put("/updateBooking/:id", update_booking);
router.delete("/deleteBooking/:id", delete_booking);
router.post("/getListBooking", get_bookings);

// Restful Api thời gian mở đóng của hàng
router.post("/updateHoursStore/:id", update_hours_store);

// Restful Api Sản phẩm
router.post("/addProduct", add_product);
router.put("/updateProduct/:id", update_product);
router.delete("/deleteProduct/:id", delete_product);
router.post("/getListProduct", get_list_product);

// Restful Api Hóa đơn
router.post("/addInvoice", add_invoice);
router.put("/updateInvoice/:id", update_invoice);
router.delete("/deleteInvoice/:id", delete_invoice);
router.post("/getListInvoice", get_list_invoice);

// Đăng nhập
router.post("/login", login);

module.exports = router;
