const router = require('express').Router();


const proscaiController = require('../controllers/proscaiController');


router.get('/server', proscaiController.list );

module.exports = router;