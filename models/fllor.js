var mongodb = require('./db');

function Fllor(room){
  this.ID = room["_id"];
  this.layers = room.layers;
  this.name   = room.name;
  this.holderInfo = room.holderInfo;
  this.area   = room.area;
  this.structure = room.structure;
}

module.exports = Fllor;

Fllor.prototype.save = function save(callback){
  var fllor = {
    layers : this.layers,
    name   : this.name,
    holderInfo : this.holderInfo,
    area     : this.area,
    structure: this.structure
  };
  
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection('fllors', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.ensureIndex('name', {unique: true}, function(err){
        if(err){
          mongodb.close();
          return callback(err);
        }
      });
      collection.insert(fllor, {safe : true}, function(err, fllor){
        mongodb.close();
        /*返回插入楼层数据库里的信息*/
        callback(err, fllor);
      });
      
    });
    
  });
};

Fllor.getOne = function get(name, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection('fllors', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
/*      var query = {};
      if(name){
        query.name = name; 
      }
      collection.find(query).sort({layers:-1}).toArray(function(err, docs){
        mongodb.close();
        if(err){
          return callback(err, null); 
        }
        var fllors = [];
        docs.forEach(function(doc, index){
          var fllor = new Fllor(doc);
          fllors.push(fllor);
        });
        callback(null, fllors);
        
      });*/
      
      collection.findOne({name : name}, function(err, doc){
        mongodb.close();
        if(doc){
          var fllor = new Fllor(doc); 
          callback(err, fllor);
        }
        else{
          callback(err, null); 
        }
      });
      
    });
    
  }); 
}

Fllor.getAll = function get(name, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('fllors', function(err, collection){
      collection.find().sort({layers: -1 }).toArray(function(err, docs){
        mongodb.close();
        if(err){
          return callback(err, null); 
        }
        var fllors = [];
        docs.forEach(function(doc, index){
          var fllor = new Fllor(doc);
          fllors.push(fllor);
        });
        callback(null, fllors);
      }); 
      
    });
  });
  
}

Fllor.update = function update(findID, updateValue, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('fllors', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.update(findID,{"$set" : updateValue}, function(err){
        mongodb.close();
        if(err){
          return callback(err);
        }
        return callback(null);
      });
    });
  });
}

Fllor.delete = function deleteFllor(findID, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err); 
    }
    db.collection('fllors', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.remove(findID, function(err){
        mongodb.close();
        if(err){
         return callback(err); 
        }
        return callback(null);
      });
    });
  });
  
}