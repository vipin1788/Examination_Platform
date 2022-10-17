const express = require('express');

const router = express.Router();
const stateController = require('../../controllers/stateController')
const stateValidator = require('../../validators/stateValidator')

router.post('/createState',stateValidator.addStateValidator,stateController.addState)
router.get('/getAllStates',stateController.getAllStates)

module.exports = router;
