const express = require('express');
const Food = require('../models/food');
const router = express.Router()
imageTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Food Spots
router.get('/', async (req, res) =>{
    let query = Food.find()
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
    let query = Food.find()    
    const food = await Food.findById(req.params.id).exec()
    query = query.find( {$and: [
        {shopName: {$regex: new RegExp(food.shopName, 'i')}},
        {name: {$ne: food.name}}
    ]}).limit(4)
    const sameShop = await query.exec()
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
    const food = await Food.findById(req.params.id).exec()
    res.render('food/edit', {
        food: food
    })
})

router.put('/:id', async (req, res) =>{
    let food = await Food.findById(req.params.id)

    food.name = req.body.name
    food.shopName = req.body.shopName
    food.address = req.body.address
    food.ratings = req.body.ratings
    food.price = req.body.price
    food.type = req.body.type
    saveImage(food, req.body.image)
    try {
        if (food.name == "" || food.shopName == "" || food.address == "" || food.postalcode == "" || food.postalcode > 80 || food.price == null || food.type == null){
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
        if (food.type == null) {
            food.errors.push("Type is empty")
        }

        res.render('food/edit', {food: food})
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
    await food.remove()
    res.redirect('/food')
})



module.exports = router