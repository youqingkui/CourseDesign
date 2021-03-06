var express = require('express');
var router = express.Router();
var Cost = require('../models/cost');
var Fllor = require("../models/fllor");
var ObjectID = require('mongodb').ObjectID;


/* GET users listing. */
router.get('/', function(req, res) {
  var date = new Date();
  var time = date.getFullYear() + "-" + ((date.getMonth()) < 9 ? "0" + (date.getMonth()+1) : date.getMonth()+1);
  Cost.get({"$or" : [{"date.month" : time}, {"date" : time}]}, function(err, costs){
    if(!costs){
      costs = []; 
    }
    return res.render("listCost", {costs : costs});
  })
});
/*接收ajax的数据请求*/
router.post("/", function(req, res){
  var month = req.body.month;
  /*查询接收到的数据信息*/
  Cost.get({"$or" : [{"date.month" : month}, {"date" : month}]}, function(err, docs){
    /*如果有则给数据*/
    if(docs){
      console.log("findVale");
      return res.send(docs);
    }
    return res.send(null);
  });
});

router.get("/fllorName/:fllorName", function(req, res){
  Cost.get({"fllorName" : req.params.fllorName}, function(err, docs){
    if(docs){
      return res.render("fllorCost", {costs : docs}); 
    }
    req.session.error = "没有用查询到楼层的费用信息";
    return res.redirect("/costs");
  });
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
  Fllor.getOne(cost.fllorName, function(err, fllor){
    if(fllor){
      Cost.get({"fllorName" : fllor.name}, function(err, docs){
        console.log("costdocs");
        console.log(docs);
        console.log("end");
        console.log(cost.date);
        if(docs && (docs[0].date.month == cost.date || docs[0].date == cost.date)){
          req.session.error = "已经添加过这个楼房的当前时间的物业费用";
          return res.redirect("/costs/add");
        }
        else{
          newCost.save(function(err, doc){
            if(err){
              req.session.error = "添加费用出现错误";
              return res.redirect("/costs/add");
            }
            req.session.success = "添加成功";
            return res.redirect("/costs/add");
          });
        }
        
      });

    }
    else{
      console.log("has?");
      req.session.error = "没有这个楼层";
      return res.redirect("back");
    }
    

  });
});

router.get("/editCost/:fllorName/:date", function(req, res){
  var month = req.params.date;
  Cost.get({"fllorName" : req.params.fllorName, "$or" : [{"date.month" : month}, {"date" : month}]}, function(err, docs){
    if(docs){
      console.log(docs);
      return res.render("editCost", {cost : docs}); 
    }
    console.log("what?");
    req.session.error = "没有这个楼层";
    return res.redirect("/costs");
  });
});

router.post("/editCost", function(req, res){
  var cost = {};
  //console.log(cost);
  var ID = new ObjectID(req.body.ID);
  cost.fllorName = req.body.fllorName.trim();
  cost.waterCost = Number(req.body.waterCost.trim());
  cost.electricityCost = Number(req.body.electricityCost.trim());
  cost.otherCost = Number(req.body.otherCost.trim());
  cost.date = req.body.date.trim();
  cost.toalCost = cost.waterCost + cost.electricityCost +cost.otherCost;
  console.log(cost);
  Cost.get({"fllorName" : cost.fllorName}, function(err, doc){
    if(doc){
      console.log("find value");
      console.log(doc);
      Cost.update({"_id" : ID}, cost, function(err){
        if(err){
          req.session.error = "更新出现错误!";
          return res.redirect("/costs");
        }
        req.session.success = "更新成功";
        return res.redirect("/costs");
      }); 
    }
  });
}); 


module.exports = router;
