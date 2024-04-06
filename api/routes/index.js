const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/account', require('./account'));

module.exports = router;