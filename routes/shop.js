const express = require('express');
const Shop = require('../models/shop');
const router = express.Router()

router.get('/', async (req, res) =>{
    const shops = await Shop.find({}).exec()
    res.render('shop/index', {shops: shops})
})

// View individual Shop
router.get('/:id', async (req, res) => {
    const shop = await Shop.findById(req.params.id).exec()
    try {
        res.render('shop/show', {
            shop: shop
        })
    } catch {
        res.send('fail')
    }
} )

// Edit Shop Spot
router.get('/:id/edit', async (req, res) =>{
    const shop = await Shop.findById(req.params.id).populate('food').exec()
    const shops = await Shop.find({})
    res.render('food/edit', {
        shop: shop,
        shops: shops,
        form: 'shop',
        action: 'edit'
    })
})

module.exports = router