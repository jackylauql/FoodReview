const express = require('express');
const Food = require('../models/food');
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
imageTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: 'public/images/foodImages',
    fileFilter: (req, file, callback) => {
        callback(null, imageTypes.includes(file.mimetype))
    }
})

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
    
    // Render after Filtering
    res.render('food/index', {
        foods: filterRatings
    })
})

// Sorting function
//foods.sort((a, b) => (a.price > b.price) ? 1 : -1)


// View individual Food Spot
router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id).exec()
    try {
        res.render('food/show', {
            food: food
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

router.put('/:id', upload.single('image'), async (req, res) =>{
    let food = await Food.findById(req.params.id)
    let oldImageName
    let newImageName
    if (req.file != null) {
        oldImageName = food.foodImage
        newImageName = req.file.filename
        food.foodImage = newImageName
    }
    
    food.name = req.body.name
    food.shopName = req.body.shopName
    food.address = req.body.address
    food.ratings = req.body.ratings
    food.price = req.body.price
    food.type = req.body.type
    try {
        if (food.name == "" || food.shopName == "" || food.address == "" || food.postalcode == "" || food.postalcode > 80 || food.price == null || food.type == null){
            throw "Error updating Food Spot"
        }

        food.save()
        fs.unlink(`public/images/foodImages/${oldImageName}`, err => {
            if (err) console.error(err)
        })
        res.redirect(`/food/${food.id}`)        
    } catch (err) {
        food.foodImage = oldImageName
        fs.unlink(`public/images/foodImages/${newImageName}`, err => {
            if (err) console.error(err)
        })
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

// Delete Food Spot
router.delete('/:id', async (req, res) =>{
    let food = await Food.findById(req.params.id)
    if (food.foodImage != null) {
        fs.unlink(`public/images/foodImages/${food.foodImage}`, err => {
            if (err) console.error(err)
        })
    }
    await food.remove()
    res.redirect('/food')
})



module.exports = router