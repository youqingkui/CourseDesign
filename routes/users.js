var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/*登入*/
router.get('/login', function(req, res){
  res.render("login", { title : "登入" });
});

/*接收登入数据*/
router.post('/login', function(req, res){
  var name = req.body.username.trim();
  var password = req.body.password.trim();
  User.get(name, function(err, user){
    /*如果没有这个用户名*/
    if(!user){
/*      var infoMsg = "没有这个用户";
      return res.render("login", { infoMsg : infoMsg });*/
      req.session.error = "用户名或密码错误";
      return res.redirect("/users/login");
    }
    //console.log(user["_id"]);
    /*存在这个用户名则加密密码与数据库中密码比对*/
    var md5 = crypto.createHash("md5");
    var md5password = md5.update(password).digest("base64");
    /*如果密码不一样*/
    if(user.password != md5password){
      req.session.error = "密码错误"; 
      return res.redirect("/users/login");
    }
    /*密码正确给出登入提示即赋值session*/
    else{
      req.session.user = user;
      console.log(user["ID"]);
      req.session.success = "登入成功";
      return res.redirect('/');  
    }
  }); 
});

/*注册*/
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
      req.session.success = "注册成功";
      return res.redirect('/');
    });
  });
  

});

/*登出*/
router.get('/logout', function(req, res){
  req.session.user = null;
  return res.redirect('/');
  
});

module.exports = router;
