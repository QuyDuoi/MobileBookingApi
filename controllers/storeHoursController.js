const { Store } = require('../models/storeModel');
const { StoreHours } = require('../models/storeHoursModel');

exports.update_hours_store = async (req, res, next) => {
    const { storeId } = req.params;
    const { hours } = req.body; // 'hours' là một mảng chứa lịch của các ngày trong tuần
  
    try {
      // Kiểm tra xem cửa hàng có tồn tại không
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }
  
      // Lặp qua từng ngày trong tuần để cập nhật hoặc tạo mới
      for (const dayHour of hours) {
        const { dayOfWeek, openTime, closeTime, isOpen } = dayHour;
  
        // Tìm lịch mở cửa của ngày cụ thể
        const storeHour = await StoreHours.findOne({ storeId, dayOfWeek });
  
        if (storeHour) {
          if (isOpen === false) {
            // Nếu người dùng chuyển isOpen sang false, xóa thời gian mở/đóng
            storeHour.openTime = null;
            storeHour.closeTime = null;
          } else {
            // Cập nhật lịch nếu đã tồn tại và isOpen là true
            storeHour.openTime = openTime;
            storeHour.closeTime = closeTime;
          }
          storeHour.isOpen = isOpen;
          await storeHour.save();
        } else {
          // Tạo lịch mới nếu chưa tồn tại
          await StoreHours.create({
            dayOfWeek,
            openTime: isOpen ? openTime : null,
            closeTime: isOpen ? closeTime : null,
            isOpen,
            storeId,
          });
        }
      }
  
      return res.status(200).json({ message: 'Store hours updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
}