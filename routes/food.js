const express = require('express');
const Food = require('../models/food');
const Shop = require('../models/shop');
const router = express.Router()
imageTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Food Spots
router.get('/', async (req, res) =>{
    let query = Food.find().populate('shopName')
    if (req.query.keyword != null && req.query.keyword != '') {
        query = query.find({ $or: [ {name: {$regex: new RegExp(req.query.keyword, 'i')}}, {address: {$regex: new RegExp(req.query.keyword, 'i')}}] })
    }
    const foods = await query.exec()
    
    // Filter Type
    if (req.query.type != null && req.query.type != ''){
        filterType = []
        foods.forEach(food => {
            food.type.forEach(foodType => {
                if (req.query.type.includes(foodType)) {
                    filterType.push(food)
                    return
                }
            })
        })
    } else {
        filterType = foods
    }

    // Filter Location
    if (req.query.location != null && req.query.location != ''){
        filterLocation = []
        try {
            filterType.forEach(food => {
                req.query.location.forEach(location => {
                    if (location.includes(food.postalcode)) {
                        filterLocation.push(food)
                        return
                    }
                })
            })
        } catch {
            filterType.forEach(food => {
                if (req.query.location.includes(food.postalcode)) {
                    filterLocation.push(food)
                    return
                    }
                })
            }
    } else {
        filterLocation = filterType
    }
    
    // Filter Ratings
    if (req.query.ratings != null){
        filterRatings = []
        filterLocation.forEach(food => {
            if (req.query.ratings.includes(food.ratings)) {
                filterRatings.push(food)
            }
        })
    } else {
        filterRatings = filterLocation
    }

    // Sort by Date
    filterRatings.sort((a, b) => (a.date > b.date) ? 1 : -1)
    
    // Render after Filtering
    res.render('food/index', {
        foods: filterRatings
    })
})

// Sorting function
//foods.sort((a, b) => (a.price > b.price) ? 1 : -1)


// View individual Food Spot
router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id).populate('shopName').exec()
    // foodQuery = foodQuery.find( {$and: [
    //     {shopName: {$regex: new RegExp(food.shopName, 'i')}},
    //     {name: {$ne: food.name}}
    // ]}).limit(4)

    const sameShopQuery = Food.find( {$and: [{shopName: food.shopName.id}, {_id: {$ne: food.id}}]}).populate('shopName').limit(4)
    const sameShop = await sameShopQuery.exec()

    try {
        res.render('food/show', {
            food: food,
            sameShop: sameShop
        })
    } catch {
        res.send('fail')
    }
} )


// Edit Food Spot
router.get('/:id/edit', async (req, res) =>{
    const food = await Food.findById(req.params.id).populate('shopName').exec()
    const shops = await Shop.find({})
    res.render('food/edit', {
        food: food,
        shops: shops,
        form: 'food',
        action: 'edit'
    })
})

router.put('/:id', async (req, res) =>{
    let food = await Food.findById(req.params.id)

    food.name = req.body.name
    food.shopName = req.body.shopName
    food.ratings = req.body.ratings
    food.price = req.body.price
    food.type = req.body.type
    saveImage(food, req.body.image)
    try {
        if (food.name == "" || food.price == null || food.type == null){
            throw "Error updating Food Spot"
        }
        food.save()   
        res.redirect(`/food/${food.id}`)        
    } catch (err) {
        food.errorMessage = err
        food.errors = []
        if (food.name == "") {
            food.errors.push("Name is empty")
        }
        if (food.shopName == "") {
            food.errors.push("Shop Name is empty")
        }
        if (food.price == null) {
            food.errors.push("Price is empty")
        }
        if (food.type == null) {
            food.errors.push("Type is empty")
        }
        const shops = await Shop.find({})
        res.render('food/edit', {
            food: food,
            shops: shops,
            form: 'food',
            action: 'edit'
        })
    }
})

const saveImage = (food, image) => {
    if (image == '') return
    const foodImage = JSON.parse(image)
    if (imageTypes.includes(foodImage.type)) {
        food.foodImage = new Buffer.from(foodImage.data, 'base64')
        food.foodImageType = foodImage.type
    }
}

// Delete Food Spot
router.delete('/:id', async (req, res) =>{
    let food = await Food.findById(req.params.id)
    let shop = await Shop.findById(food.shopName)
    for (let i = 0; i < shop.allRatings.length; i++) {
        if (allRatings[i] == food.ratings) {
            allRatings.splice(i, 1)
            break
        }
    }
    shop.ratings = calculateAverage(shop.allRatings)
    await food.remove()
    res.redirect('/food')
})


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