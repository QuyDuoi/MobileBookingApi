const { Category } = require("../models/categoryModel");

// Thêm danh mục
exports.add_category = async (req, res, next) => {
  try {
    const { nameCategory } = req.body;

    // Kiểm tra nếu danh mục đã tồn tại
    const existingCategory = await Category.findOne({ nameCategory });
    if (existingCategory) {
      return res.status(400).json({ msg: "Danh mục đã tồn tại" });
    }

    const category = new Category({ nameCategory });
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
    const { nameCategory } = req.body;

    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: "Danh mục không tồn tại" });
    }

    // Kiểm tra nếu danh mục mới đã tồn tại (ngoại trừ danh mục hiện tại)
    const existingCategory = await Category.findOne({ nameCategory });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ msg: "Danh mục đã tồn tại" });
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

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ msg: "Danh mục không tồn tại" });
    }

    res.status(200).json({ msg: "Đã xóa danh mục" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Lấy danh sách danh mục
exports.get_list_category = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
