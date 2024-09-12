const { mongoose } = require("./db");
const { StoreHours } = require("./storeHoursModel");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String },
    image: { type: String },
  },
  {
    collection: "Store",
    timestamps: true,
  }
);

storeSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Tạo các giờ hoạt động mặc định khi cửa hàng được tạo
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (const day of daysOfWeek) {
      await StoreHours.create({
        dayOfWeek: day,
        storeId: this._id, // Liên kết với cửa hàng hiện tại
      });
    }
  }
  next();
});

let Store = mongoose.model("Store", storeSchema);
module.exports = { Store };
