var express = require('express');
var router = express.Router();
var Cost = require('../models/cost');
var Fllor = require("../models/fllor");


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
        if(docs && (docs[0].date.month == cost.date || docs[0].date == cost.date)){
          req.session.error = "已经添加过这个楼房的当前时间的物业费用";
          return res.redirect("/costs/add");
        }
        else if(docs){
          newCost.save(function(err, doc){
            if(err){
              req.session.error = "添加费用出现错误";
              return res.redirect("/costs/add");
            }
            req.session.success = "添加成功";
            return res.redirect
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

router.get("/editCost/:fllorName", function(req, res){
  Cost.get({"fllorName" : req.params.fllorName}, function(err, docs){
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
      Cost.update({"fllorName" : doc[0].fllorName}, cost, function(err){
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
