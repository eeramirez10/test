const router = require('express').Router();


const proscaiController = require('../controllers/proscaiController');
const tuvansaController = require('../controllers/tuvansaController');


router.get('/server', proscaiController.list );

router.post('/data', tuvansaController.insert )

module.exports = router;