const mongoose = require('mongoose');
let local = 'mongodb+srv://mobileBookingService:Tq1tRCvjmeotvpIK@mobilebooking.s8oaz.mongodb.net/Booking?retryWrites=true&w=majority'
const connect = async() => {
        try {
                await mongoose.connect(local,
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
