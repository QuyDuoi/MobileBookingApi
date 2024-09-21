const { mongoose } = require("./db");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    id_store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true }, // Sản phẩm thuộc cửa hàng nào
  },
  {
    collection: "Product",
    timestamps: true,
  }
);

let Product = mongoose.model("Product", productSchema);
module.exports = { Product };
