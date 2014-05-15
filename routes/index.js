var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');
var Cost = require('../models/cost');
var Failure = require('../models/failure');
var ObjectID = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '***物业管理' });
});

router.get('/query', function(req, res){
  return res.render('queryCost', {title : '费用查询'});
});

router.post('/query', function(req, res){
  var holderName = req.body.holderName.trim();
  var fllorName  = req.body.fllorName.trim();
  var phoneNum   = req.body.phoneNum.trim();
  var identityNum = req.body.identityNum.trim();
  var date       = req.body.date.trim();
  Holder.get({
              "holderName": holderName,
              "fllorName": fllorName,
              "phoneNum": phoneNum,
              "identityNum": identityNum
  }, function(err, doc){
    if(doc){
      Cost.get({"fllorName" : fllorName, "$or" : [{"date.month" : date}, {"date" : date}]}, function(err, cost){
        if(cost){
          return res.render("queryResult", {title : "查询结果", costs : cost}); 
        }
        req.session.error = "没有查询到当月费用信息";
        return res.redirect("/query");
      }); 
    }
    else{
      req.session.error = "没有查询到住户信息";
      return res.redirect("/query");
    }
  });
});

router.get("/failure", function(req, res){
  return res.render("failureForm", {title : "故障申报"});
});

router.post("/failure", function(req, res){
  var f = {};
  f.holderName = req.body.holderName.trim();
  f.phoneNum   = req.body.phoneNum.trim();
  f.fllorName  = req.body.fllorName.trim();
  f.content    = req.body.content.trim();
  newFailure = new Failure(f);
  newFailure.save(function(err, doc){
    if(err){
      req.session.error = "出现错误";
      return res.redirect("/failure")
    }
    req.session.success = "申报成功,请保管号您的工单号码方便查询: " + doc[0]["_id"].toString(); 
    //console.log(doc[0]["_id"]);
    //return res.send(doc[0]._id.toString());
    return res.redirect("/failure");
  });
});







module.exports = router;
