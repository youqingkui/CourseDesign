var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');
var Cost = require('../models/cost');
var Failure = require('../models/failure');
var ObjectID = require('mongodb').ObjectID;

router.get("/", function(req, res){
  Failure.get({}, function(err, docs){
    if(err){
      req.session.error = "出现错误";
      return res.redirect("/");
    }
    return res.render("listReports", {reports : docs, title : "故障申报情况"}); 
    
  });
});

router.get('/do/:ID', function(req, res){
  var ID = new ObjectID(req.params.ID);
  Failure.get({"_id" : ID}, function(err, doc){
    if(err){
      req.session.error = "查找对应单号信息出错";
      return res.redirect("back");
    }
    return res.render("doFailures", {title : "处理申报", docs : doc})
  });
});

router.post('/do/:ID', function(req, res){
  var ID = new ObjectID(req.body.ID);
  var updateValue = req.body.doPeople;
  console.log(updateValue);
  Failure.update({"_id" : ID}, {"doPeople" : updateValue, "status" : "1"}, function(err){
    if(err){
      req.session.error = "处理出现错误";
      return res.redirect("back");
    }
    req.session.success = "成功处理工单";
    return res.redirect("/failures");
  })
});

module.exports = router;