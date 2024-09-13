const { Booking } = require("../models/bookingsModel");
const { Employee } = require("../models/employeeModel");

// Thêm booking mới
exports.add_booking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(400).json({ message: "Error creating booking", error });
  }
};

// Sửa booking
exports.update_booking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res
      .status(200)
      .json({
        message: "Booking updated successfully",
        booking: updatedBooking,
      });
  } catch (error) {
    res.status(400).json({ message: "Error updating booking", error });
  }
};

// Xóa booking
exports.delete_booking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting booking", error });
  }
};

// Lấy danh sách booking
exports.get_bookings = async (req, res) => {
  try {
    const { userId } = req.body; // Lấy ID người dùng từ token hoặc session
    console.log(userId);

    const user = await Employee.findById(userId).populate("id_store");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let bookings;
    if (user.userRole === "admin") {
      // Nếu là admin thì lấy toàn bộ danh sách booking
      bookings = await Booking.find().populate("id_employee id_store services");
    } else {
      // Nếu là storeManagement hoặc staff thì chỉ lấy danh sách booking của cửa hàng mà họ quản lý
      bookings = await Booking.find({ id_store: user.id_store }).populate(
        "id_employee id_store services"
      );
    }

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving bookings", error });
  }
};
