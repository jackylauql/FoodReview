const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shopName: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    ratings: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: Array,
        required: true
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

foodSchema.virtual('foodImagePath').get(function() {
    return `data:${this.foodImageType};charset=utf-8;base64,${this.foodImage.toString('base64')}`
})

module.exports = mongoose.model('Food', foodSchema)