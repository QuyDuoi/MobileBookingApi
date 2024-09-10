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
const {update_hours_store} = require("../controllers/storeHoursController");

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

// Restful Api thời gian mở đóng của hàng
router.post("/updateHoursStore/:id", update_hours_store);

module.exports = router;
