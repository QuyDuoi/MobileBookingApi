const { Service } = require('../models/serviceModel');
const { Category } = require('../models/categoryModel');

// Thêm dịch vụ
exports.add_service = async (req, res, next) => {
    try {
        const {stt, nameService, descreption, price, duration, time, id_category } = req.body;

        // Kiểm tra nếu dịch vụ đã tồn tại
        const existingService = await Service.findOne({ nameService });
        if (existingService) {
            return res.status(400).json({ msg: 'Dịch vụ đã tồn tại' });
        }

        // Kiểm tra nếu danh mục có tồn tại
        if (id_category) {
            const category = await Category.findById(id_category);
            if (!category) {
                return res.status(400).json({ msg: 'Danh mục không tồn tại' });
            }
        }

        const service = new Service({ stt, nameService, descreption, price, duration, time, id_category });
        const result = await service.save();

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Cập nhật dịch vụ
exports.update_service = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stt, nameService, descreption, price, duration, time, id_category } = req.body;

        // Kiểm tra dịch vụ có tồn tại không
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ msg: 'Dịch vụ không tồn tại' });
        }

        // Kiểm tra nếu dịch vụ mới đã tồn tại (ngoại trừ dịch vụ hiện tại)
        const existingService = await Service.findOne({ nameService });
        if (existingService && existingService._id.toString() !== id) {
            return res.status(400).json({ msg: 'Dịch vụ đã tồn tại' });
        }

        // Kiểm tra nếu danh mục có tồn tại
        if (id_category) {
            const category = await Category.findById(id_category);
            if (!category) {
                return res.status(400).json({ msg: 'Danh mục không tồn tại' });
            }
        }

        service.stt = stt
        service.nameService = nameService;
        service.descreption = descreption;
        service.price = price;
        service.duration = duration
        service.time = time;
        service.id_category = id_category;

        const result = await service.save();

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Xóa dịch vụ
exports.delete_service = async (req, res, next) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({ msg: 'Dịch vụ không tồn tại' });
        }

        res.status(200).json({ msg: 'Đã xóa dịch vụ' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Lấy danh sách dịch vụ
exports.get_list_service = async (req, res, next) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });

        res.status(200).json(services);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
