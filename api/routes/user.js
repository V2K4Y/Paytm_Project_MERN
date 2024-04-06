const { signup, signin, userUpdate, getUsers } = require('../controllers/user');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/signup', signup);

router.post('/signin', signin);
router.put('/', authMiddleware, userUpdate);
router.get('/', authMiddleware, getUsers)

module.exports = router;