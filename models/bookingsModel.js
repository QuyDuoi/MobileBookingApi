const { mongoose } = require("./db");

const bookingsSchema = new mongoose.Schema(
    {
        customerName: { type: String, require: true},
        phoneNumber: { type: String, require: true, unique: true},
        dateBooking: { type: String, require: true},
        id_employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        id_store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
        status: { type: Boolean, require: true},
        price: { type: String, require: true},
        note: { type: String, require: true}
    },
    {
        collection: "Booking",
        timestamps: true,
    }
)

let Booking = mongoose.model("Booking", bookingsSchema);
module.exports = { Booking };