const { Invoice } = require("../models/invoiceModel");
const { Product } = require("../models/productModel");
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

// Hàm lấy dữ liệu doanh thu 6 tháng gần nhất
const getLastSixMonthsRevenue = async () => {
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // 6 tháng bao gồm cả tháng hiện tại

  // Tạo danh sách các tháng trong 6 tháng gần nhất
  const monthsList = [];
  for (let i = 0; i < 6; i++) {
    const month = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
    const monthString = `${month.getMonth() + 1}-${month.getFullYear()}`; // Định dạng MM-YYYY
    monthsList.push(monthString);
  }

  try {
    const revenueData = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lte: currentDate },
          paymentStatus: "paid", // Chỉ tính những hóa đơn đã thanh toán
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" }, // Tính tổng doanh thu
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" },
            ],
          },
          totalRevenue: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Tạo một map từ dữ liệu doanh thu đã có
    const revenueMap = revenueData.reduce((acc, item) => {
      acc[item.month] = item.totalRevenue;
      return acc;
    }, {});

    // Trả về danh sách 6 tháng với giá trị 0 cho những tháng không có doanh thu
    const result = monthsList.map(month => ({
      month,
      totalRevenue: revenueMap[month] || 0,
    }));

    return result;
  } catch (error) {
    throw new Error("Error fetching revenue data: " + error);
  }
};

// Hàm lấy dữ liệu doanh thu của 4 tuần trong tháng hiện tại
const getWeeklyRevenueInCurrentMonth = async () => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Tạo danh sách các tuần trong tháng hiện tại
  const weeksList = [];
  let weekStart = new Date(startOfMonth);
  let weekEnd;

  // Tạo danh sách các tuần bắt đầu từ tuần 1 đến tuần 4 trong tháng
  while (weekStart <= endOfMonth) {
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Giới hạn tuần cuối cùng trong tháng
    if (weekEnd > endOfMonth) {
      weekEnd = new Date(endOfMonth);
    }

    weeksList.push({
      start: new Date(weekStart),
      end: new Date(weekEnd),
      weekLabel: `Week ${weeksList.length + 1}`,
    });

    // Di chuyển đến tuần tiếp theo
    weekStart.setDate(weekStart.getDate() + 7);
  }

  try {
    // Lấy dữ liệu doanh thu theo tuần trong tháng hiện tại
    const revenueData = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          paymentStatus: "paid", // Chỉ tính những hóa đơn đã thanh toán
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $isoWeek: "$createdAt" }, // Lấy số tuần trong năm
          },
          totalRevenue: { $sum: "$totalAmount" }, // Tính tổng doanh thu trong tuần
        },
      },
    ]);

    // Tạo một map để tra cứu doanh thu theo tuần
    const revenueMap = revenueData.reduce((acc, item) => {
      acc[item._id.week] = item.totalRevenue;
      return acc;
    }, {});

    // Lấy số tuần hiện tại
    const currentWeek = Math.ceil(currentDate.getDate() / 7);

    // Trả về dữ liệu doanh thu cho từng tuần trong tháng
    const result = weeksList.map((week, index) => ({
      week: week.weekLabel,
      totalRevenue: revenueMap[currentWeek - index] || 0, // Doanh thu hoặc 0 nếu không có
    }));

    return result;
  } catch (error) {
    throw new Error("Error fetching weekly revenue data: " + error);
  }
};

// Hàm lấy dữ liệu doanh thu theo ngày truyền vào
const getRevenueByDate = async (year, month, day) => {
  // Tạo đối tượng ngày bắt đầu và kết thúc của ngày cụ thể
  const startOfDay = new Date(year, month - 1, day); // tháng bắt đầu từ 0
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999); // Kết thúc ngày

  try {
    // Lấy dữ liệu doanh thu cho ngày được chỉ định
    const revenueData = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }, // Lọc theo ngày
          paymentStatus: "paid", // Chỉ tính những hóa đơn đã thanh toán
        },
      },
      {
        $group: {
          _id: null, // Không cần nhóm theo bất kỳ field nào khác ngoài tổng doanh thu
          totalRevenue: { $sum: "$totalAmount" }, // Tính tổng doanh thu
        },
      },
    ]);

    // Nếu không có dữ liệu, doanh thu là 0
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Trả về doanh thu của ngày
    return {
      date: `${day}-${month}-${year}`,
      totalRevenue: totalRevenue
    };
  } catch (error) {
    throw new Error("Error fetching revenue data: " + error);
  }
};

exports.get_revenue_day = async (req, res) => {
  const { year, month, day } = req.query; // Lấy ngày, tháng, năm từ query parameters
  if (!year || !month || !day) {
    return res.status(400).json({ error: 'Missing year, month, or day parameters' });
  }

  try {
    const data = await getRevenueByDate(parseInt(year), parseInt(month), parseInt(day));
    res.json(data); // Trả về JSON để frontend có thể sử dụng
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.get_revenue_four_week = async (req, res) => {
  try {
    const data = await getWeeklyRevenueInCurrentMonth();
    res.json(data); // Trả về JSON để frontend có thể sử dụng
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.get_revenue_six_months = async (req, res) => {
  try {
    const data = await getLastSixMonthsRevenue();
    res.json(data); // Trả về JSON để frontend có thể sử dụng
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
