const express = require('express')
const router = express.Router()
const Food = require('../models/food')
const food = require('../models/food')

router.get('/', (req, res) =>{
    res.render('index')
})

// New Food Spot

router.get('/new', (req, res) =>{
    const food = new Food()
    res.render('new', {food: food}) 
})

router.post('/new', async (req, res) =>{
    const food = new Food({
        name: req.body.name,
        address: req.body.address,
        postalcode: req.body.postalcode,
        ratings: req.body.ratings,
        price: req.body.price,
        type: req.body.type
    })
    try {
        const newFood = await food.save()
        res.redirect(`food/${newFood.id}`)
    } catch (err) {
        food.errorMessage = "Error Creating New Food Spot"
        food.errors = []
        if (food.name == "") {
            food.errors.push("Name is empty")
        }
        if (food.address == "") {
            food.errors.push("Address is empty")
        }
        if (food.postalcode == null) {
            food.errors.push("Postal Code is empty")
        } else if (food.postalcode.length != 6) {
            food.errors.push("Invalid Postal Code")
        }
        if (food.ratings == "") {
            food.errors.push("Please select Ratings")
        }
        if (food.price == null) {
            food.errors.push("Price is empty")
        } 
        res.render('new', {food: food})
    }
    
})

module.exports = router