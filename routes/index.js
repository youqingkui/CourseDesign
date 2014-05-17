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
/*进入费用查询功能*/
router.get('/query', function(req, res){
  return res.render('queryForm', {title : '费用查询'});
});
/*接收查询表单请求*/
router.post('/query', function(req, res){
  var holderName = req.body.holderName.trim();
  var fllorName  = req.body.fllorName.trim();
  var phoneNum   = req.body.phoneNum.trim();
  var identityNum = req.body.identityNum.trim();
  var date       = req.body.date.trim();
  /*验证是否有这个住户*/
  Holder.get({
              "holderName": holderName,
              "fllorName": fllorName,
              "phoneNum": phoneNum,
              "identityNum": identityNum
  }, function(err, doc){
    /*验证通过查询是否有本月费用数据*/
    if(doc){
      Cost.get({"fllorName" : fllorName, "$or" : [{"date.month" : date}, {"date" : date}]}, function(err, cost){       
        /*有要查询的的月份费用数据，显示查询结果*/
        if(cost){
          return res.render("queryResult", {title : "查询结果", costs : cost}); 
        }
        req.session.error = "没有查询到当月费用信息";
        return res.redirect("/query");
      }); 
    }
    /*没有则给出提示信息*/
    else{
      req.session.error = "没有查询到住户信息";
      return res.redirect("/query");
    }
  });
});
/*进入故障申报功能*/
router.get("/report", function(req, res){
  return res.render("failureForm", {title : "故障申报"});
});

/*接收申报表单数据*/
router.post("/report", function(req, res){
  var f = {};
  f.holderName = req.body.holderName.trim();
  f.phoneNum   = req.body.phoneNum.trim();
  f.fllorName  = req.body.fllorName.trim();
  f.content    = req.body.content.trim();
  newFailure = new Failure(f);
  /*存储数据到数据库中*/
  newFailure.save(function(err, doc){
    if(err){
      req.session.error = "出现错误";
      return res.redirect("/report")
    }
    /*给出产生的工单号*/
    req.session.success = "申报成功,请保管号您的工单号码方便查询: " + doc[0]["_id"].toString(); 
    //console.log(doc[0]["_id"]);
    //return res.send(doc[0]._id.toString());
    return res.redirect("/report");
  });
});

/*进入申报进度查询功能*/
router.get("/reportStatus", function(req, res){
  return res.render("reportStatus", {title : "申报进度查询"});
});

/*接收查询工单数据*/
router.post("/reportStatus", function(req, res){
  /*处理工单号码是否异常*/
  try{
    var ID = new ObjectID(req.body.ID);
  }catch(error){
    req.session.error = "工单错误";
    return res.redirect("back");
  }
  /*工单格式正确，进行查询信息*/
  Failure.get({"_id" : ID}, function(err, docs){
    if(docs){
      /*如果已经受理给出信息*/
      if(docs[0].status == '1'){
        var text = "<b>已经受理,处理人是: " + docs[0].doPeople +"请保持联系电话畅通，我们会尽快联系您!</b>";  
      }
      else{
        var text = "<b>暂为受理，我们会尽快处理</b>"; 
      }
      /*给出查询到的信息*/
      req.session.success = text + "<p>您的信息: 联系人:" + docs[0].holderName + ",联系电话:" + docs[0].phoneNum +",申报内容:"
      + docs[0].content +"</p>";
      return res.redirect("back");
    }
    req.session.error = "没有查询到信息，请确认工单号码正确";
    return res.redirect("back");
  });
});




module.exports = router;
