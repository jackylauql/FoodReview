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
    recommendationQuery = await recommendationFood.find({ $or: [{ratings : 5}, {ratings : 4}]}).exec()
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

router.get('/new', async (req, res) =>{
    const food = new Food()
    const shop = new Shop()
    const shopsQuery = Shop.find({}).populate('food')
    const shops = await shopsQuery.exec()
    res.render('new', {
        food: food, 
        shop: shop, 
        shops: shops, 
        form:'food', 
        action: 'new'
    }) 
})

router.post('/new', async (req, res) =>{

    // Create new Food
    const food = new Food({
        name: req.body.name,
        shopName: req.body.shopName,
        ratings: req.body.ratings,
        price: req.body.price,
        type: req.body.type
    })
    
    // Save new Food in Shop
    let shop = await Shop.findById(req.body.shopName)
    shop.food.push(food.id)

        // Calculate New Rating
    shop.allRatings.push(food.ratings)
    shop.ratings = calculateAverage(shop.allRatings)

        // Calculate new Price Range
    if (shop.minPrice > food.price) {
        shop.minPrice = food.price
    }
    if (shop.maxPrice < food.price) {
        shop.maxPrice = food.price
    }
    shop.priceRange = `${shop.minPrice} to ${shop.maxPrice}`

        // Add new types (if any)

    food.type.forEach(type => {
        if (shop.type.includes(type) == false) {
            shop.type.push(type)
        }
    })

    // Save database
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
        await shop.save()
        res.redirect(`food/${newFood.id}`)

    // Push any error messages
    } catch (err) {
        food.errorMessage = "Error Creating New Food Spot"
        food.errors = []
        if (food.name == "") {
            food.errors.push("Name is empty")
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
        const shops = await Shop.find({})
        const shop = new Shop()
        res.render('new', {
            food: food, 
            shop: shop,
            shops: shops, 
            form: 'food',
            action: 'new'
        })
    }
})

router.post('/newShop', async (req, res ) => {
    const shop = new Shop({
        shopName: req.body.shopName,
        address: req.body.address,
        postalcode: req.body.postalcode
    })
    try {
        saveImage(shop, req.body.image)
        const newShop = await shop.save()
        res.redirect(`shop/${newShop.id}`)
    } catch {
        res.send('fail')
    }
    
})

const saveImage = (food, image) => {
    const foodImage = JSON.parse(image)
    if (imageTypes.includes(foodImage.type)) {
        food.foodImage = new Buffer.from(foodImage.data, 'base64')
        food.foodImageType = foodImage.type
    }
}


const calculateAverage = (array) => {
    var index = 0
    var totalRatings = 0
    while (index < array.length) {
        totalRatings += array[index]
        index = index + 1
    }

    var averageRating = Math.floor((totalRatings / array.length) * 10) / 10
    return averageRating
}


module.exports = router