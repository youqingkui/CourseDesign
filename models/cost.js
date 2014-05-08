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
    month: date.getFullYear() + "-" + (date.getMonth() +1),
    day  : date.getFullYear() + "-" + (date.getMonth() +1) + "-" + date.getDate(),
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
      collection.ensureIndex('fllorName', {unique: true});
      collection.insert(cost, {safe : true}, function(err, cost){
        mongodb.close();
        return callback(err, cost);
      });
    });
  });
}