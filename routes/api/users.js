var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.mpdel('User');
var = require('../auth');

router.post('/users', function(req, res, next)){
  var user = new User();
}


module.exports = router;
