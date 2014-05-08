var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Fllor = require('../models/fllor.js');
var Holder = require('../models/holder.js');
var ObjectID = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/*登入*/
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
