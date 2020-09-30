const router = require('express').Router();
const tuvansaController = require('../controllers/tuvansaController');

router.post('/data', tuvansaController.insert )

module.exports = router;