const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeHoursSchema = new Schema({
  dayOfWeek: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  openTime: {
    type: String,
    default: null, // Chỉ có giá trị khi isOpen = true
  },
  closeTime: {
    type: String,
    default: null, // Chỉ có giá trị khi isOpen = true
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});

let StoreHours = mongoose.model("StoreHours", storeHoursSchema);

module.exports = { StoreHours };
