const { Store } = require('../models/storeModel');

// Thêm cửa hàng với hình ảnh
exports.add_store = async (req, res, next) => {
    try {
        const { name, address, location, phoneNumber } = req.body;
        let image = '';

        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        }

        // Kiểm tra nếu cửa hàng đã tồn tại
        const existingStore = await Store.findOne({ name });
        if (existingStore) {
            return res.status(400).json({ msg: 'Cửa hàng đã tồn tại' });
        }

        const store = new Store({ name, address, location, phoneNumber, image });
        const result = await store.save();

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Cập nhật cửa hàng với hình ảnh
exports.update_store = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address, location, phoneNumber } = req.body;
        let image = '';

        // Kiểm tra cửa hàng có tồn tại không
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ msg: 'Cửa hàng không tồn tại' });
        }

        // Kiểm tra nếu cửa hàng mới đã tồn tại (ngoại trừ cửa hàng hiện tại)
        const existingStore = await Store.findOne({ name });
        if (existingStore && existingStore._id.toString() !== id) {
            return res.status(400).json({ msg: 'Cửa hàng đã tồn tại' });
        }

        // Cập nhật các thuộc tính của cửa hàng
        store.name = name;
        store.address = address;
        store.location = location;
        store.phoneNumber = phoneNumber;

        // Cập nhật đường dẫn hình ảnh nếu có file mới được tải lên
        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
        }
        store.image = image || store.image;

        const result = await store.save();

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Xóa cửa hàng
exports.delete_store = async (req, res, next) => {
    try {
        const { id } = req.params;

        const store = await Store.findByIdAndDelete(id);
        if (!store) {
            return res.status(404).json({ msg: 'Cửa hàng không tồn tại' });
        }

        res.status(200).json({ msg: 'Đã xóa cửa hàng' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Lấy danh sách cửa hàng
exports.get_list_store = async (req, res, next) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 });

        res.status(200).json(stores);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
