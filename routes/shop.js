const express = require('express');
const Shop = require('../models/shop');
const router = express.Router()

router.get('/', async (req, res) =>{
    let query = Shop.find().populate('food')
    if (req.query.keyword != null && req.query.keyword != '') {
        query = query.find({ $or: [ {address: {$regex: new RegExp(req.query.keyword, 'i')}}, {shopName: {$regex: new RegExp(req.query.keyword, 'i')}}] })
    }
    const shops = await query.exec()
    
    // Filter Type
    if (req.query.type != null && req.query.type != ''){
        filterType = []
        shops.forEach(shop => {
            shop.type.forEach(shopType => {
                if (req.query.type.includes(shopType)) {
                    filterType.push(shop)
                    return
                }
            })
        })
    } else {
        filterType = shops
    }

    // Filter Location
    if (req.query.location != null && req.query.location != ''){
        filterLocation = []
        try {
            filterType.forEach(shop => {
                req.query.location.forEach(location => {
                    if (location.includes(shop.postalcode)) {
                        filterLocation.push(shop)
                        return
                    }
                })
            })
        } catch {
            filterType.forEach(shop => {
                if (req.query.location.includes(shop.postalcode)) {
                    filterLocation.push(shop)
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
        filterLocation.forEach(shop => {
            if (req.query.ratings.includes(Math.round(shop.ratings).toString())) {
                filterRatings.push(shop)
            }
        })
    } else {
        filterRatings = filterLocation
    }

    // Sort by Date
    filterRatings.sort((a, b) => (a.date > b.date) ? 1 : -1)
    
    // Render after Filtering
    res.render('shop/index', {shops: filterRatings})
})

// View individual Shop
router.get('/:id', async (req, res) => {
    const shop = await Shop.findById(req.params.id).populate('food').exec()
    try {
        res.render('shop/show', {
            shop: shop
        })
    } catch {
        res.send('fail')
    }
})

// Edit Shop
router.get('/:id/edit', async (req, res) =>{
    const shop = await Shop.findById(req.params.id).populate('food').exec()
    res.render('shop/edit', {
        shop: shop,
        form: 'shop',
        action: 'edit'
    })
})

router.put('/:id', async (req, res) =>{
    let shop = await Shop.findById(req.params.id).populate('food').exec()
    shop.shopName = req.body.shopName
    shop.address = req.body.address
    shop.postalcode = req.body.postalcode
    saveImage(shop, req.body.image)
    try {
        if (shop.shopName == "" || shop.address == '' || shop.postalcode == '' ){
            throw "Error updating Shop"
        }
        shop.save()
        res.redirect(`/shop/${shop.id}`)
    } catch (err) {
        shop.errorMessage = err
        shop.errors = []
        if (shop.shopName == "") {
            shop.errors.push("Shop's Name is empty")
        }
        if (shop.address == "") {
            shop.errors.push("Shop's Address is empty")
        }
        if (shop.postalcode == "") {
            shop.errors.push("Shop's Area Code is empty")
        }
        res.render('shop/edit', {
            shop: shop,
            form: 'shop',
            action: 'edit'
        })
    }
})

// Delete Shop
router.delete('/:id', async (req, res) =>{
    let shop = await Shop.findById(req.params.id).populate('food').exec()
    try {
        await shop.remove()
        res.redirect('/shop')
    } catch (err) {
        shop.errorMessage = err.message
        res.render('shop/show', {shop: shop})
    }
})

const saveImage = (shop, image) => {
    if (image == '') return
    const shopImage = JSON.parse(image)
    if (imageTypes.includes(shopImage.type)) {
        shop.foodImage = new Buffer.from(shopImage.data, 'base64')
        shop.foodImageType = shopImage.type
    }
}

module.exports = router