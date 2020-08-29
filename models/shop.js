const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postalcode: {
        type: String,
        required: true,
    },
    ratings: {
        type: String,
        required: true,
        default: 'NA'
    },
    price: {
        type: Number,
        required: true,
        default: 'NA'
    },
    type: {
        type: Array,
        required: true,
        default: 'NA'
    },
    foodImage: {
        type: Buffer,
        required: true
    },
    foodImageType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Shop', shopchema)