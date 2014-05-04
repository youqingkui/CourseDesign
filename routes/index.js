var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res){
  res.render("login", { title : "登入" });
});

router.post('/login', function(req, res){
  var name = req.body.username.trim();
  var password = req.body.password.trim();
  User.get(name, function(err, user){
    if(!user){
      var infoMsg = "没有这个用户";
      return res.render("login", { infoMsg : infoMsg });
    }
    //console.log(user["_id"]);
    var md5 = crypto.createHash("md5");
    var md5password = md5.update(password).digest("base64");
    if(user.password != md5password){
      var infoMsg = "密码错误"; 
      return res.render("login", { infoMsg : infoMsg });
    }
    else{
      req.session.user = user;
      console.log(user["ID"]);
      return res.redirect('/');
       
    }
    
  });
  
  
});

router.get('/reg', function(req, res){
  res.render("reg", { title : "注册"});
  
});

router.post('/reg', function(req, res){
  var username = req.body.username.trim();
  var password = req.body.password.trim();
  var password_rp = req.body["password-repeat"].trim() 
  if(!username){
    var infoMsg = "用户名为空";
    return res.render("reg", { infoMsg : infoMsg });
  }
  if(!password){
    var infoMsg = "密码为空";
    return res.render("reg", { infoMsg : infoMsg });
  }
  if(password != password_rp){
    var infoMsg = "两次密码不一致";
    return res.render("reg", { infoMsg : infoMsg});
  }
  
  User.get(username, function(err, user){
    if(user){
      var infoMsg = "用户已存在";
      return res.render("reg", { infoMsg : infoMsg});
    }
    var md5 = crypto.createHash("md5");
    var md5password = md5.update(password).digest("base64");
    var newUser = new User({
      name : username,
      password : md5password
    });
    newUser.save(function(err){
      if(err){
        var infoMsg = "注册失败"
        return res.render("reg", { infoMsg : infoMsg});
      }
      return res.redirect('/');
    });
  });
  

});

router.get('/logout', function(req, res){
  req.session.user = null;
  return res.redirect('/');
  
});


router.get('/addFllor', function(req, res){
  return res.render('addFllor', { title : "新建楼层"});
});

router.post('/addFllor', function(req, res){
  var layers = req.body.layers.trim();
  console.log(layers);
  var roomName   = req.body.roomNumber.trim();
  var newFllor = new Fllor({
    layers : layers,
    name   : roomName
  });
  Fllor.getOne(newFllor.name, function(err, fllor){
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
  });

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

router.get('/listFllor', function(req, res){
  Fllor.getAll(null, function(err, fllor){
    return res.render("listFllor", {fllors : fllor});
  })
  
});


router.get('/addHolder', function(req, res){
  return res.render("addHolder", {title : "添加住户" });
  
});

router.post('/addHolder', function(req, res){
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


router.get("/listHolder", function(req, res){
  Holder.get(null, function(err, holders){
    console.log(holders);
    return res.render("listHolder", {holders: holders}); 
  });
  
});

module.exports = router;
