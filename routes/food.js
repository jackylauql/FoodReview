const express = require('express');
const Food = require('../models/food');
const router = express.Router()

// All Food Spots
router.get('/', async (req, res) =>{
    let query = Food.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    const foods = await query.exec()
    if (req.query.location != null && req.query.location != ''){
        filterLocation = []
        foods.forEach(food => {
            req.query.location.forEach(location => {
                if (location.includes(food.postalcode)) {
                    filterLocation.push(food)
                    return
                }
            })
        })
    } else {
        filterLocation = foods
    }
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


router.put('/:id', async (req, res) =>{
    let food = await Food.findById(req.params.id)
    food.name = req.body.name
    food.address = req.body.address
    food.ratings = req.body.ratings
    food.price = req.body.price
    food.type = req.body.type
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