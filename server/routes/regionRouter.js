const Router = require('express')
const router = new Router

const RegionController = require('../controllers/regionController')

//!  http://localhost:5000/map/region/findRegion
router.get('/findRegion', RegionController.findRegion)

module.exports = router