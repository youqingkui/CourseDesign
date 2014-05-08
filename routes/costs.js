var express = require('express');
var router = express.Router();
var Cost = require('../models/cost');


/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/add', function(req, res){
  
  return res.render('addCost', {title : "录入物业费用"});
});

router.post('/add', function(req, res){
  var cost = {};
  console.log(cost);
  cost.fllorName = req.body.fllorName.trim();
  cost.waterCost = Number(req.body.waterCost.trim());
  cost.electricityCost = Number(req.body.electricityCost.trim());
  cost.otherCost = Number(req.body.otherCost.trim());
  cost.date = req.body.date.trim();
  console.log(cost);
  var newCost = new Cost(cost);
  console.log(newCost);
  newCost.save(function(err){
    if(err){
      return callback(err); 
    }
    req.session.error = "测试flash" 
    return res.redirect('/costs/add');
  });
});


module.exports = router;
