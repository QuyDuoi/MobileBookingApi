const {mongoose} = require('./db');
const categorySchema = new mongoose.Schema(
    {
        nameCategory:{type:String, required: true, unique: true},
    },
    {
        collection: 'Category',
        timestamps: true
    }
);

let Category = mongoose.model('Category', categorySchema);
module.exports = {Category};
