const router = require('express').Router();


const proscaiController = require('../controllers/proscaiController');


router.get('/', proscaiController.list );

module.exports = router;