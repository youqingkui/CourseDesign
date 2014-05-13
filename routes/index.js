var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');
var ObjectID = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});







module.exports = router;
