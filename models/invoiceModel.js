const { mongoose } = require("./db");

const invoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true }, // Số lượng sản phẩm
      },
    ],
    services: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      },
    ],
    totalAmount: { type: Number, required: true }, // Tổng giá trị hóa đơn
    paymentMethod: { type: String, enum: ["cash", "credit", "bank_transfer"], required: true }, // Hình thức thanh toán
    paymentStatus: { type: String, enum: ["paid", "unpaid"], required: true }, // Trạng thái thanh toán
    id_store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  },
  {
    collection: "Invoice",
    timestamps: true,
  }
);

let Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = { Invoice };
