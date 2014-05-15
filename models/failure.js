var mongodb = require('./db');

function Failure(failure){
  this.ID = failure["_id"];
  this.holderName = failure.holderName;
  this.phoneNum = failure.phoneNum;
  this.fllorName = failure.fllorName;
  this.content = failure.content;
  this.doPeople = failure.doPeople;
  this.status  = failure.status;
}

module.exports = Failure;

Failure.prototype.save = function save(callback){
  var failure = { 
    holderName : this.holderName,
    phoneNum   : this.phoneNum,
    fllorName  : this.fllorName,
    connect    : this.content,
    doPeople   : this.doPeople,
    status     : this.status
  }
  
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('failures', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.insert(failure, {safe : true}, function(err, doc){
        mongodb.close();
        return callback(err, doc);
      });
    });
    
  });
}

Failure.get = function get(findValue, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection('failure', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.find(findValue).sort({"fllorName": -1}).toArray(function(err, docs){
        mongodb.close();
        if(docs.length){
          var failures = [];
          docs.forEach(function(doc, index){
            var failure = new Failure(doc);
            failures.push(failure);
          });
          return callback(null, failures);
        }
        return callback(null);
      });
    });
  
  });
}