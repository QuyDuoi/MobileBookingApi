const { Product } = require("../models/productModel");
const { Store } = require("../models/storeModel");

// Thêm sản phẩm mới
exports.add_product = async (req, res) => {
  try {
    const { name, price, quantity, description, id_store } = req.body;
    console.log(req.body);

    let image = "";

    // Kiểm tra nếu có file ảnh upload
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/public/uploads/${
        req.file.filename
      }`;
    }

    // Kiểm tra nếu sản phẩm đã tồn tại
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ msg: "Sản phẩm đã tồn tại" });
    }

    // Kiểm tra nếu cửa hàng có tồn tại
    const store = await Store.findById(id_store);

    if (!store) {
      return res.status(400).json({ msg: "Cửa hàng không tồn tại" });
    }

    const product = new Product({
      name,
      price,
      quantity,
      description,
      image,
      id_store,
    });

    const result = await product.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Cập nhật sản phẩm
exports.update_product = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, description, id_store } = req.body;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Sản phẩm không tồn tại" });
    }

    // Cập nhật thông tin sản phẩm
    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.description = description;
    product.id_store = id_store;

    // Cập nhật ảnh nếu có file mới
    if (req.file) {
      product.image = `${req.protocol}://${req.get("host")}/public/uploads/${
        req.file.filename
      }`;
    }

    const result = await product.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Xóa sản phẩm
exports.delete_product = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ msg: "Sản phẩm không tồn tại" });
    }

    res.status(200).json({ msg: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Lấy danh sách sản phẩm
exports.get_list_product = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("id_store");

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
