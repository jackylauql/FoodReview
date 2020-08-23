if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const app = express()
const indexRouter = require('./routes/index')
const foodRouter = require('./routes/food')
const categoryRouter = require('./routes/category')
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use('/', indexRouter)
app.use('/food', foodRouter)
app.use('/category', categoryRouter)


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.listen(process.env.PORT || 3000)