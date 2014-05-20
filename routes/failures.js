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

/*查看故障工单详情*/
router.get('/do/:ID', function(req, res){
  /*接受要查询的工单号ID*/
  var ID = new ObjectID(req.params.ID);
  /*找到工单号的详细信息*/
  Failure.get({"_id" : ID}, function(err, doc){
    if(err){
      req.session.error = "查找对应单号信息出错";
      return res.redirect("back");
    }
    return res.render("doFailures", {title : "处理申报", docs : doc})
  });
});

/*接受要处理的工单号码*/
router.post('/do/:ID', function(req, res){
  
  var ID = new ObjectID(req.body.ID);
  /*获取添加的处理人信息*/
  var updateValue = req.body.doPeople;
  console.log(updateValue);
  /*找到要处理的工单号码并修改*/
  Failure.update({"_id" : ID}, {"doPeople" : updateValue, "status" : "1"}, function(err){
    /*返回处理是否成功信息*/
    if(err){
      req.session.error = "处理出现错误";
      return res.redirect("back");
    }
    req.session.success = "成功处理工单";
    return res.redirect("/failures");
  })
});

module.exports = router;