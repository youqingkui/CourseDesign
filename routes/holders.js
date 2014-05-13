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

  Fllor.getOne(fllorName, function(err, fllor){
    if(fllor && (!fllor.holderInfo)){
      newHolder.save(function(err, holder){
        if(err){
          var errorMsg = "新建出现错误";
          return res.render("addHolder", {errorMsg : errorMsg});
        }
        var updateValue = { 
            holderName : holderName,
            phoneNum   : phoneNum,
            identityNum: identityNum,
            date       : date,
            ID         : holder[0]["_id"]
        };
        console.log(updateValue);
        Fllor.update({name : fllorName}, {holderInfo : updateValue}, function(err){
          if(err){
            var errorMsg = "更新对应楼层信息出现错误";
            return res.render("addHolder", {errorMsg : errorMsg});
          }
          var successMsg = "新建成功";
          return res.render("addHolder", {successMsg : successMsg});
        });
        
      });
    }
    else if(!fllor){
      var errorMsg = "没有这个楼房";
      return res.render("addHolder", {errorMsg : errorMsg});
    }
    else if(fllor &&(fllor.holderInfo)){
      var errorMsg = "这个楼房已经有用户入驻";
      return res.render("addHolder", {errorMsg : errorMsg});
    }
  });

  
});


router.get("/", function(req, res){
  Holder.get(null, function(err, holders){
    
    return res.render("listHolder", {holders: holders}); 
  });
  
});

router.get("/edit/:phoneNum", function(req, res){
  console.log(req.params.phoneNum);
  Holder.get({"phoneNum":req.params.phoneNum}, function(err, holder){
    if(holder){
      //console.log(holder);
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
      //console.log("find");
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
          req.session.error = "删除出现错误";
          return res.redirect('/holders');
        }
        Fllor.update({"holderInfo.ID" : HolderID }, {holderInfo : null}, function(err){
          if(err){
            req.session.error = "修改对应楼层信息失败";
            return res.redirect("/holders");
          }
          req.session.success = "删除用户成功";
          return res.redirect('/holders');
        });
        
      });
    }
  });
});

module.exports = router;
