var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');
var ObjectID = require('mongodb').ObjectID;

/*住户模块*/
router.get('/add', function(req, res){
  return res.render("addHolder", {title : "添加住户" });
  
});

router.post('/add', function(req, res){
  var holderName = req.body.holderName.trim();
  var phoneNum   = req.body.phoneNum.trim();
  var identityNum = req.body.identityNum.trim();
  var date        = req.body.date.trim();
  var fllorName   = req.body.fllorName.trim();
  var newHolder = new Holder({
    holderName : holderName,
    phoneNum   : phoneNum,
    identityNum: identityNum,
    date       : date,
    fllorName  : fllorName
  });
  newHolder.save(function(err){
    if(err){
      var errorMsg = "error";
      return res.render("addHolder", {errorMsg : errorMsg});
    }
    else{
      var successMsg = "添加成功";
      return res.render("addHolder", {successMsg : successMsg});
    }
  });
  
});


router.get("/", function(req, res){
  Holder.get(null, function(err, holders){
    console.log(holders);
    return res.render("listHolder", {holders: holders}); 
  });
  
});

router.get("/edit/:phoneNum", function(req, res){
  console.log(req.params.phoneNum);
  Holder.get({"phoneNum":req.params.phoneNum}, function(err, holder){
    if(holder){
      console.log(holder);
      return res.render("editHolder", {holder : holder}); 
    }
    
  });
  
});

router.post("/edit", function(req, res){
  var holderName = req.body.holderName.trim();
  var phoneNum   = req.body.phoneNum.trim();
  var identityNum = req.body.identityNum.trim();
  var date        = req.body.date.trim();
  var fllorName   = req.body.fllorName.trim();
  var newHolder = {
    holderName : holderName,
    phoneNum   : phoneNum,
    identityNum: identityNum,
    date       : date,
    fllorName  : fllorName
  };
  var holderID = new ObjectID (req.body.holderID);
  Holder.get({"_id" : holderID}, function(err, holder){
    if(holder){
      console.log("find");
      Holder.update({"_id":holderID}, newHolder, function(err){
        if(err){
          console.log(err); 
        }
        var successMsg = "修改成功";
        return res.redirect("/holders");
      });
      
    }
  });
});

router.get("/delete/:ID", function(req, res){
  var HolderID = new ObjectID(req.params.ID);
  Holder.get({"_id" : HolderID}, function(err, holder){
    if(holder){
      Holder.delete({"_id" : HolderID}, function(err){
        if(err){
          console.log(err); 
        }
        return res.redirect('/holders');
      });
    }
  });
});

module.exports = router;
