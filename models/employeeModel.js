const { mongoose } = require("./db");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    image: { type: String },
    id_store: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
  },
  {
    collection: "Employee",
    timestamps: true,
  }
);

let Employee = mongoose.model("Employee", employeeSchema);
module.exports = { Employee };
