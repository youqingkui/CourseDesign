var mongodb = require('./db');

function Cost(cost){
  this.ID        = cost["_id"];
  this.fllorName = cost.fllorName;
  this.date      = cost.date;
  this.waterCost = cost.waterCost;
  this.electricityCost = cost.electricityCost;
  this.otherCost = cost.otherCost;
  this.toalCost  = cost.waterCost + cost.electricityCost + cost.otherCost;
}

module.exports = Cost;

Cost.prototype.save = function save(callback){
  var date = new Date();
  var time ={
    date : date,
    year : date.getFullYear(),
    month: date.getFullYear() + "-" + ((date.getMonth()) < 9 ? "0" + (date.getMonth()+1) : date.getMonth()+1),
    day  : date.getFullYear() + "-" + ((date.getMonth()) < 9 ? "0" + (date.getMonth()+1) : date.getMonth()+1) + "-" + date.getDate(),
    minute: date.getFullYear() + "-" + (date.getMonth() +1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + ((date.getMinutes) < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  if(this.date){
    time = this.date;   
  }
  
  var cost = {
    fllorName : this.fllorName,
    date      : time,
    waterCost : this.waterCost,
    electricityCost : this.electricityCost,
    otherCost : this.otherCost,
    toalCost  : this.toalCost
  };
  
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection('costs', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.ensureIndex('fllorName', {unique: true}, function(err){
        if(err){
          mongodb.close();
          return callback(err);
        }
      });
      collection.insert(cost, {safe : true }, function(err, cost1){
        mongodb.close();
        return callback(err, cost1);
      });
    })
  });
  
}

Cost.get = function get(findValue, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection("costs", function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.find(findValue).sort({"fllorName" : -1 }).toArray(function(err, docs){
        mongodb.close();
        console.log("docs start");
        console.log(docs);
        console.log("end");
        if(docs.length){
          var costs = [];
          docs.forEach(function(doc, index){
            var cost = new Cost(doc);
            costs.push(cost);
          });
          console.log("1234");
          return callback(null, costs);
          
        }
        console.log("324");
        return callback(null);
        
      });
    });
  });
  
}

Cost.update = function update(findValue, updateValue, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection("costs", function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.update(findValue, {"$set" : updateValue}, function(err, doc){
        console.log("更新后的值:" + doc);
        mongodb.close();
        if(err){
          return callback(err);
        }
        return callback(null);
      });
    });
  });
  
}