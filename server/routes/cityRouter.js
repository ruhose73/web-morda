const Router = require('express')
const router = new Router

const CityController = require('../controllers/cityController')

//!  http://localhost:5000/map/city/findCity
router.get('/findCity', CityController.findCity)

module.exports = router