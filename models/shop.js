const mongoose = require('mongoose')
const Food = require('./food.js')

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
        type: Number,
        required: true,
        default: 0
    },
    allRatings: {
        type: Array,  
        default: []
    },
    priceRange: {
        type: String,
        required: true,
        default: 'NA'
    },
    minPrice: {
        type: Number,
        required: true,
        default: 100
    },
    maxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: Array,
        required: true,
        default: []
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
    },
    food: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    }]
})

shopSchema.pre('remove', function(next){
    Food.find({shopName: this.id}, (err, food) => {
        if (err){
            next(err)
        } else if (food.length > 0) {
            next(new Error(`Unable to delete ${this.shopName}, please delete all food under ${this.shopName} first`))
        } else {
            next()
        }
    })
})

shopSchema.virtual('foodImagePath').get(function() {
    return `data:${this.foodImageType};charset=utf-8;base64,${this.foodImage.toString('base64')}`
})

module.exports = mongoose.model('Shop', shopSchema)