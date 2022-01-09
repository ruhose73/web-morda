const Router = require('express')
const router = new Router

const regionRouter = require('./regionRouter')
const cityRouter = require('./cityRouter')

//!  http://localhost:5000/map/region
router.use('/region', regionRouter)

//!  http://localhost:5000/map/city
router.use('/city', cityRouter)

module.exports = router