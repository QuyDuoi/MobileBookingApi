const mongoose = require('mongoose');
let local = ''
const connect = async() => {
        try {
                await mongoose.connect('mongodb://127.0.0.1:27017/MobileBooking',
                {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                })
                console.log('connect success')
        } catch (error){
                console.log(error)
                console.log('connect fail')
        }
}
module.exports = { mongoose, connect}
