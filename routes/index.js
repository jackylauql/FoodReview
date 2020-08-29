const express = require('express')
const router = express.Router()
const Food = require('../models/food')
const Shop = require('../models/shop')
imageTypes = ['image/jpeg', 'image/png']

router.get('/', async (req, res) =>{
    highlightFood = Food.find()
    highlightQuery = highlightFood.sort({"date": -1}).limit(4)
    const food = await highlightQuery.exec()
    food.sort((a, b) => (a.date > b.date) ? 1 : -1)
    
    recommendationFood = Food.find()
    recommendationQuery = await recommendationFood.find({ $or: [{ratings : "5 Star"}, {ratings : "4 Star"}]}).exec()
    randomIndexArray = []
    
    while (randomIndexArray.length < 4 && randomIndexArray.length < recommendationQuery.length) {
        let randomIndex = Math.floor(Math.random() * recommendationQuery.length)
        if (randomIndexArray.includes(randomIndex) == false) {
            randomIndexArray.push(randomIndex)
        }
    }
    
    var randomRecommendation = []
    for (index in randomIndexArray) {
        randomRecommendation.push(recommendationQuery[index])
    }
    
    res.render('index', {food: food, randomRecommendation: randomRecommendation})
})

// New Food Spot

router.get('/new', (req, res) =>{
    const food = new Food()
    const shop = new Shop()
    res.render('new', {food: food}) 
})

router.post('/new', async (req, res) =>{
    const food = new Food({
        name: req.body.name,
        shopName: req.body.shopName,
        address: req.body.address,
        postalcode: req.body.postalcode,
        ratings: req.body.ratings,
        price: req.body.price,
        type: req.body.type
    })    
    
    try {
        if (food.postalcode > 82){
            throw "Invalid Postal Code"
        }
        if (food.type == ''){
            throw "Type is empty"
        }
        if (req.body.image == null) {
            throw "Image is required"
        }
        saveImage(food, req.body.image)
        const newFood = await food.save()
        res.redirect(`food/${newFood.id}`)
    } catch (err) {
        food.errorMessage = "Error Creating New Food Spot"
        food.errors = []
        if (food.name == "") {
            food.errors.push("Name is empty")
        }
        if (food.shopName == "") {
            food.errors.push("Shop Name is empty")
        }
        if (food.address == "") {
            food.errors.push("Address is empty")
        }
        if (food.postalcode == "") {
            food.errors.push("Postal Code is empty")
        } else if (food.postalcode > 80) {
            food.errors.push(err)
        }
        if (food.price == null) {
            food.errors.push("Price is empty")
        }
        if (food.type == '') {
            food.errors.push("Type is empty")
        }
        if (req.body.image == '') {
            food.errors.push("Image is required")
        }
        res.render('new', {food: food})
    }
})

const saveImage = (food, image) => {
    const foodImage = JSON.parse(image)
    if (imageTypes.includes(foodImage.type)) {
        food.foodImage = new Buffer.from(foodImage.data, 'base64')
        food.foodImageType = foodImage.type
    }
}

router.post('/newShop', async (req, res ) => {
    const shop = new Shop({
        shopName: req.body.shopName,
        address: req.body.address,
        postalcode: req.body.postalcode
    })
})

module.exports = router