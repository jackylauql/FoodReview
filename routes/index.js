const express = require('express')
const router = express.Router()
const Food = require('../models/food')
const multer = require('multer')
const fs = require('fs')
imageTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: 'public/images/foodImages',
    fileFilter: (req, file, callback) => {
        callback(null, imageTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) =>{
    let query = Food.find().sort({"date": -1}).limit(3)
    const food = await query.exec()
    res.render('index', {food: food})
})

// New Food Spot

router.get('/new', (req, res) =>{
    const food = new Food()
    res.render('new', {food: food}) 
})

router.post('/new', upload.single('image'), async (req, res) =>{
    const imageName = req.file != null ? req.file.filename : null
    const food = new Food({
        name: req.body.name,
        shopName: req.body.shopName,
        address: req.body.address,
        postalcode: req.body.postalcode,
        ratings: req.body.ratings,
        price: req.body.price,
        foodImage: imageName,
        type: req.body.type
    })    
    try {
        if (food.postalcode > 82){
            throw "Invalid Postal Code"
        }
        if (food.type == ''){
            throw "Type is empty"
        }
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
        if (food.foodImage != null) {
            fs.unlink(`public/images/foodImages/${food.foodImage}`, err => {
                if (err) console.error(err)
            })
        }
        res.render('new', {food: food})
    }
    
})

module.exports = router