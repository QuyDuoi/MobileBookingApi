const {mongoose} = require('./db');
const categorySchema = new mongoose.Schema(
    {
        nameCategory:{type:String, required: true, unique: true},
        id_store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
    },
    {
        collection: 'Category',
        timestamps: true
    }
);

let Category = mongoose.model('Category', categorySchema);
module.exports = {Category};
