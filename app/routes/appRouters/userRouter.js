const express = require('express');

const router = express.Router();
const userController = require('../../controllers/userController')
const userValidator = require('../../validators/userValidator')

router.post('/createUserType',userValidator.addUserTypeValidator,userController.addUserType)
router.get('/getAllUserType',userController.getAllUserType)
router.post('/addUser',userController.addUser)
router.post('/login',userController.login)

module.exports = router;
