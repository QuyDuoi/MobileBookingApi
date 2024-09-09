const {mongoose} = require('./db');
const serviceSchema = new mongoose.Schema(
    {
        nameService:{type:String, required: true, unique: true},
        descreption:{type: String, require: true},
        price: {type: Number},
        time: {type: String},
        id_category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    },
    {
        collection: 'Service',
        timestamps: true
    }
);

let Service = mongoose.model('Service', serviceSchema);
module.exports = {Service};
