const { Category } = require("../models/categoryModel");

// Thêm danh mục
exports.add_category = async (req, res, next) => {
  try {
    const { nameCategory, id_store } = req.body;

    // Kiểm tra nếu danh mục đã tồn tại cho cửa hàng này
    const existingCategory = await Category.findOne({ nameCategory, id_store });
    if (existingCategory) {
      return res
        .status(400)
        .json({ msg: "Danh mục đã tồn tại cho cửa hàng này" });
    }

    const category = new Category({ nameCategory, id_store });
    const result = await category.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Cập nhật danh mục
exports.update_category = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nameCategory, id_store } = req.body;

    // Kiểm tra danh mục có tồn tại cho cửa hàng này không
    const category = await Category.findOne({ _id: id, id_store });
    if (!category) {
      return res
        .status(404)
        .json({ msg: "Danh mục không tồn tại cho cửa hàng này" });
    }

    // Kiểm tra nếu danh mục mới đã tồn tại cho cửa hàng này (ngoại trừ danh mục hiện tại)
    const existingCategory = await Category.findOne({ nameCategory, id_store });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res
        .status(400)
        .json({ msg: "Danh mục đã tồn tại cho cửa hàng này" });
    }

    category.nameCategory = nameCategory;
    const result = await category.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Xóa danh mục
exports.delete_category = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_store } = req.body;

    const category = await Category.findOneAndDelete({ _id: id, id_store });
    if (!category) {
      return res
        .status(404)
        .json({ msg: "Danh mục không tồn tại cho cửa hàng này" });
    }

    res.status(200).json({ msg: "Đã xóa danh mục" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Lấy danh sách danh mục
exports.get_list_category = async (req, res, next) => {
  try {
    const { id_store } = req.query;

    const categories = await Category.find({ id_store }).sort({
      createdAt: -1,
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
