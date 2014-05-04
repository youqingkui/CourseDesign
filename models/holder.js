var mongodb = require('./db');

function Holder(holder){
  this.ID = holder["_id"];
  this.holderName = holder.holderName;
  this.phoneNum = holder.phoneNum;
  this.identityNum = holder.identityNum;
  this.date = holder.date;
  this.fllorName = holder.fllorName;
}

module.exports = Holder;

Holder.prototype.save = function save(callback){
  var holder = {
    holderName : this.holderName,
    phoneNum : this.phoneNum,
    identityNum : this.identityNum,
    date : this.date,
    fllorName : this.fllorName
  }
  
  mongodb.open(function(err, db){
    
    if(err){
      return callback(err);
    }
    db.collection('holders', function(err, collection){
      if(err){
        mongodb.close(); 
        return callback(err);
      }
      collection.ensureIndex('phoneNum', {unique: true});
      collection.insert(holder, {safe : true}, function(err, holder){
        mongodb.close();
        return callback(err, holder); 
      });
      
    });
    
    
  });
}

Holder.get = function get(phoneNumber, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection('holders', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.find().sort({holderName : -1}).toArray(function(err, docs){
        mongodb.close();
        if(err){
          return callback(err); 
        }
        var holders = [];
        docs.forEach(function(doc, index){
          var holder = new Holder(doc);
          holders.push(holder);
        });
        callback(null, holders);
        
        
      });
    });
    
  });
  
}