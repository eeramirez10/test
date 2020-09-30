const router = require('express').Router();
const cors = require('cors');
const tuvansaController = require('../controllers/tuvansaController');

router.use(cors());
router.post('/data', tuvansaController.insert )

module.exports = router;