const router = require('express').Router();

router.use('/comment', require('./comment'));

module.exports = router;