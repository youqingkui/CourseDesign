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
  return res.render('queryForm', {title : '费用查询'});
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

router.get("/report", function(req, res){
  return res.render("failureForm", {title : "故障申报"});
});

router.post("/report", function(req, res){
  var f = {};
  f.holderName = req.body.holderName.trim();
  f.phoneNum   = req.body.phoneNum.trim();
  f.fllorName  = req.body.fllorName.trim();
  f.content    = req.body.content.trim();
  newFailure = new Failure(f);
  newFailure.save(function(err, doc){
    if(err){
      req.session.error = "出现错误";
      return res.redirect("/report")
    }
    req.session.success = "申报成功,请保管号您的工单号码方便查询: " + doc[0]["_id"].toString(); 
    //console.log(doc[0]["_id"]);
    //return res.send(doc[0]._id.toString());
    return res.redirect("/report");
  });
});


router.get("/reportStatus", function(req, res){
  return res.render("reportStatus", {title : "申报进度查询"});
});


router.post("/reportStatus", function(req, res){
  try{
    var ID = new ObjectID(req.body.ID);
  }catch(error){
    req.session.error = "工单错误";
    return res.redirect("back");
  }
  Failure.get({"_id" : ID}, function(err, docs){
    if(docs){
      if(docs[0].status == '1'){
        var text = "<b>已经受理,处理人是: " + docs[0].doPeople +"请保持联系电话畅通，我们会尽快联系您!</b>";  
      }
      else{
        var text = "<b>暂为受理，我们会尽快处理</b>"; 
      }
      req.session.success = text + "<p>您的信息: 联系人:" + docs[0].holderName + ",联系电话:" + docs[0].phoneNum +",申报内容:"
      + docs[0].content +"</p>";
      return res.redirect("back");
    }
    return console.log("no");
  });
});




module.exports = router;
