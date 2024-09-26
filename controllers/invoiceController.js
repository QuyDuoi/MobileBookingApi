const { Invoice } = require("../models/invoiceModel");
const { Product } = require("../models/productModel");
const { Service } = require("../models/serviceModel");
const { Store } = require("../models/storeModel");

// Thêm hóa đơn mới và trừ số lượng sản phẩm
exports.add_invoice = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const {
      customerName,
      phoneNumber,
      products,
      services,
      totalAmount,
      paymentMethod,
      paymentStatus,
      id_store,
    } = req.body;

    // Kiểm tra xem cửa hàng có tồn tại không
    const store = await Store.findById(id_store);
    if (!store) {
      return res.status(400).json({ msg: "Cửa hàng không tồn tại" });
    }

    // Kiểm tra số lượng sản phẩm có đủ không
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        return res
          .status(400)
          .json({ msg: `Sản phẩm với ID ${item.productId} không tồn tại` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          msg: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
        });
      }

      // Trừ số lượng sản phẩm
      product.quantity -= item.quantity;
      await product.save({ session });
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

    const result = await invoice.save({ session });

    // Hoàn tất giao dịch
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(result);
  } catch (error) {
    // Nếu có lỗi, hủy giao dịch
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ msg: error.message });
  }
};

// Cập nhật hóa đơn và điều chỉnh số lượng sản phẩm
exports.update_invoice = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const {
      customerName,
      phoneNumber,
      products,
      services,
      totalAmount,
      paymentMethod,
      paymentStatus,
      id_store,
    } = req.body;

    // Lấy hóa đơn hiện tại
    const invoice = await Invoice.findById(id).populate("products.productId");
    if (!invoice) {
      return res.status(404).json({ msg: "Hóa đơn không tồn tại" });
    }

    // Cập nhật thông tin chung
    invoice.customerName = customerName;
    invoice.phoneNumber = phoneNumber;
    invoice.services = services;
    invoice.totalAmount = totalAmount;
    invoice.paymentMethod = paymentMethod;
    invoice.paymentStatus = paymentStatus;
    invoice.id_store = id_store;

    // Lưu trữ danh sách sản phẩm cũ trong hóa đơn
    const oldProducts = invoice.products.map((item) => ({
      productId: item.productId._id.toString(),
      quantity: item.quantity,
    }));

    // Xử lý cập nhật số lượng sản phẩm
    for (const newItem of products) {
      const existingItem = invoice.products.find(
        (item) => item.productId._id.toString() === newItem.productId
      );

      const product = await Product.findById(newItem.productId).session(
        session
      );

      if (!product) {
        return res
          .status(400)
          .json({ msg: `Sản phẩm với ID ${newItem.productId} không tồn tại` });
      }

      // Nếu sản phẩm đã tồn tại trong hóa đơn trước đó
      if (existingItem) {
        const quantityDifference = newItem.quantity - existingItem.quantity;

        if (quantityDifference > 0) {
          // Trường hợp số lượng sản phẩm tăng -> trừ thêm số lượng sản phẩm trong kho
          if (product.quantity < quantityDifference) {
            return res
              .status(400)
              .json({
                msg: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
              });
          }
          product.quantity -= quantityDifference;
        } else if (quantityDifference < 0) {
          // Trường hợp số lượng sản phẩm giảm -> hoàn lại số lượng vào kho
          product.quantity += Math.abs(quantityDifference);
        }
      } else {
        // Trường hợp thêm sản phẩm mới vào hóa đơn
        if (product.quantity < newItem.quantity) {
          return res
            .status(400)
            .json({
              msg: `Sản phẩm ${product.name} không đủ số lượng trong kho`,
            });
        }
        product.quantity -= newItem.quantity;
      }

      await product.save({ session });
    }

    // Kiểm tra các sản phẩm bị loại bỏ khỏi hóa đơn (không có trong sản phẩm mới)
    for (const oldItem of oldProducts) {
      const stillInInvoice = products.find(
        (newItem) => newItem.productId === oldItem.productId
      );

      // Nếu sản phẩm trong hóa đơn cũ nhưng không còn trong hóa đơn mới -> hoàn lại toàn bộ số lượng
      if (!stillInInvoice) {
        const product = await Product.findById(oldItem.productId).session(
          session
        );
        product.quantity += oldItem.quantity;
        await product.save({ session });
      }
    }

    // Cập nhật lại danh sách sản phẩm trong hóa đơn
    invoice.products = products;

    const result = await invoice.save({ session });

    // Hoàn tất giao dịch
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(result);
  } catch (error) {
    // Nếu có lỗi, hủy giao dịch
    await session.abortTransaction();
    session.endSession();
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
    const invoices = await Invoice.find()
      .populate("products.productId services.serviceId id_store")
      .sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
