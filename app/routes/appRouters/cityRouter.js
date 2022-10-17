const express = require('express');

const router = express.Router();
const cityController = require('../../controllers/cityController')
const cityValidator = require('../../validators/cityValidator')

router.post('/createCity',cityValidator.addCityValidator,cityController.addCity)
router.get('/getAllCity',cityController.getAllCity)
router.get('/getCities/:state_id',cityController.getCitiesByState)

module.exports = router;
