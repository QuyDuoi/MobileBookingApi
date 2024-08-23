const {mongoose} = require('./db');

const storeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        address: {type: String, required: true},
        location: {type: String, required: true},
        phoneNumber: {type: String},
        image: {type: String},
    },
    {
        collection: 'Store',
        timestamps: true
    }
);

let Store = mongoose.model('Store', storeSchema);
module.exports = {Store};
