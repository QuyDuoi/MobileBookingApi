const { Invoice } = require("../models/invoiceModel");
const { Product } = require("../models/productModel");
const { Service } = require("../models/serviceModel");
const { Store } = require("../models/storeModel");

// Thêm hóa đơn mới
exports.add_invoice = async (req, res) => {
  try {
    const { customerName, phoneNumber, products, services, totalAmount, paymentMethod, paymentStatus, id_store } = req.body;

    // Kiểm tra xem cửa hàng có tồn tại không
    if (id_store) {
      const store = await Store.findById(id_store);
      if (!store) {
        return res.status(400).json({ msg: "Cửa hàng không tồn tại" });
      }
    }

    // Tạo hóa đơn mới
    const invoice = new Invoice({
      customerName,
      phoneNumber,
      products,
      services,
      totalAmount,
      paymentMethod,
      paymentStatus,
      id_store,
    });

    const result = await invoice.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Cập nhật hóa đơn
exports.update_invoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phoneNumber, products, services, totalAmount, paymentMethod, paymentStatus, id_store } = req.body;

    // Kiểm tra hóa đơn có tồn tại không
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ msg: "Hóa đơn không tồn tại" });
    }

    // Cập nhật thông tin hóa đơn
    invoice.customerName = customerName;
    invoice.phoneNumber = phoneNumber;
    invoice.products = products;
    invoice.services = services;
    invoice.totalAmount = totalAmount;
    invoice.paymentMethod = paymentMethod;
    invoice.paymentStatus = paymentStatus;
    invoice.id_store = id_store;

    const result = await invoice.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Xóa hóa đơn
exports.delete_invoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      return res.status(404).json({ msg: "Hóa đơn không tồn tại" });
    }

    res.status(200).json({ msg: "Đã xóa hóa đơn" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Lấy danh sách hóa đơn
exports.get_list_invoice = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("products.productId services.serviceId id_store").sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
