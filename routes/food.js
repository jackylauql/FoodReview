const express = require('express');
const Food = require('../models/food');
const router = express.Router()


// All Food Spots
router.get('/', async (req, res) =>{
    let query = Food.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.location != null && req.query.location != '') {
        query = query.regex('location', new RegExp(req.query.location, 'i'))
    }
    const foods = await query.exec()
    res.render('food/index', {
        foods: foods
    })
})

// Sorting function
//foods.sort((a, b) => (a.price > b.price) ? 1 : -1)


// View individual Food Spot
router.get('/:id', async (req, res) => {
    const food = await Food.findById(req.params.id).exec()
    res.render('food/show', {
        food: food
    })
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
    food.location = req.body.location
    food.mrt = req.body.mrt
    food.ratings = req.body.ratings
    food.price = req.body.price
    food.cuisine = req.body.cuisine
    try {
        food.save()
        res.redirect(`/food/${food.id}`)        
    } catch {
        res.send('fail')
    }
})

// Delete Food Spot
router.delete('/:id', async (req, res) =>{
    let food = await Food.findById(req.params.id)
    await food.remove()
    res.redirect('/food')
})



module.exports = router