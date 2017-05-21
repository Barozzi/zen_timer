var express = require('express');
var router = express.Router();
var TITLE = 'zen_timer';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: TITLE });
});

router.get('/signin', function(req, res, next) {
	res.render('signin', { title: TITLE});
});


module.exports = router;
