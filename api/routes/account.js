const { getBalance, transfer } = require('../controllers/accounts');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get('/balance', authMiddleware,  getBalance);
router.post('/transfer', authMiddleware, transfer)

module.exports = router;