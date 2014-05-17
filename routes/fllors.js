var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');
var ObjectID = require('mongodb').ObjectID;

/*增加楼房*/
router.get('/add', function(req, res){
  return res.render('addFllor', { title : "新建楼层"});
});
/*接收要添加的住房信息*/
router.post('/add', function(req, res){
  var layers = req.body.layers.trim();
  var area   = req.body.area.trim();
  var structure = req.body.structure.trim();
  var roomName   = req.body.roomNumber.trim();
  var newFllor = new Fllor({
    layers : layers,
    name   : roomName,
    structure : structure,
    area   : area
    
  });
    /*检查是否已经添加过这个住房*/
  Fllor.getOne(newFllor.name, function(err, fllor){
    /*如果要添加的住房已经存在*/
    if(fllor){
      var errorMsg = "已经存在这个楼层";
      return res.render("addFllor", {errorMsg : errorMsg});
    }
    /*存储数据到数据库*/
    newFllor.save(function(err){
      if(err){
        var errorMsg = "出现错误";
        return res.render("addFllor", {errorMsg : errorMsg});
      }
      var successMsg = "添加成功";
      return res.render("addFllor", {successMsg : successMsg});
    });
  });
/*  Fllor.getOne(newFllor.name, function(err, fllor){
    if(fllor){
      if(fllor.layers == newFllor.layers){
        var errorMsg = "已经存在这个楼层";
        return res.render("addFllor", { errorMsg : errorMsg });
      }
      else{
        newFllor.save(function(err){
          if(err){
            var errorMsg = "创建失败";
            return res.render("addFllor", { errorMsg : errorMsg });
          }
          var successMsg = "新建成功"; 
          return res.render("addFllor", { successMsg : successMsg});
        });
        
      }
      
    }
    else{
      newFllor.save(function(err){
        var successMsg = "新建成功2";
        return res.render("addFllor", { successMsg : successMsg});
      });
      
    }
  });*/

/*  Fllor.getOne(newFllor.layers, function(err, fllor){
    if(fllor){
      if(newFllor.name == fllor.name){
        var errorMsg = "已经存在这个楼层";
        return res.render("addFllor", { errorMsg : errorMsg });
      }
    }
  });*/
/*  newFllor.save(function(err){
    if(err){
      var infoMsg = "添加失败";
      return res.render("addFllor", {infoMsg : infoMsg });
    }
    else{
      var infoMsg = "添加成功";
      return res.render("addFllor", {infoMsg : infoMsg });
    }
  });*/
});

router.get('/', function(req, res){
  Fllor.getAll(null, function(err, fllor){
    return res.render("listFllor", {fllors : fllor});
  })
  
});

/*编辑楼房*/
router.get("/edit/:roomname", function(req, res){
  var roomname = req.params.roomname;
  Fllor.getOne(roomname, function(err, fllor){
    if(fllor){
      console.log(fllor);
      return res.render("editFllor", { title : "编辑楼层", fllor : fllor}); 
    }
  });
  
});

router.post("/edit/", function(req, res){
  var layers = req.body.layers.trim();
  var area   = req.body.area.trim();
  var structure = req.body.structure.trim();
  var roomName   = req.body.roomNumber.trim();
  var findID = new ObjectID(req.body.fllorID);
  var newFllor = {
    layers : layers,
    area   : area,
    structure : structure,
    roomName  : roomName,
  }
  Fllor.update({"_id" : findID}, newFllor, function(err){
    if(err){
      return console.log(err); 
    }
    console.log("update fllor ok");
    return res.redirect('/fllors');
  });
});

/*删除楼房*/
router.get("/delete/:roomname", function(req, res){
  var roomname = req.params.roomname;
  Fllor.delete({name : roomname}, function(err){
    if(err){
      console.log(err); 
    }
    return res.redirect('/fllors');
  });
});



module.exports = router;
