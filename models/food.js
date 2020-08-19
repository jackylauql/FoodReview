const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    mrt: {
        type: String,
        required: true
    },
    ratings: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Food', foodSchema)