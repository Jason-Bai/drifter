var redis = require('redis'),
    client = redis.createClient(),
    client2 = redis.createClient(),
    client3 = redis.createClient();

// throw a bottle
exports.throw = function (bottle, callback) {
    client2.SELECT(2, function () {
        client2.GET(bottle.owner, function (err, result) {
            if(result >= 10) {
                return callback({code: 0, msg: 'you have throw 10 battles today!'});
            }
            client2.INCR(bottle.owner, function () {
                client2.TTL(bottle.owner, function (err, ttl) {
                    if(ttl == -1) {
                        client2.EXPIRE(bottle.owner, 86400);
                    }
                });
            });
        });

        bottle.time = bottle.time || Date.now();
        // generate a id for a bottle
        var bottleId = Math.random().toString(16);
        var type = {male : 0, female : 1};
        // save bottle into a different database
        client.SELECT(type[bottle.type], function () {
            // store a bottle by hash type
            client.HMSET(bottleId, bottle, function (err, result) {
                if(err) { // error
                    // return a error json object 
                    return callback({ code : 0, msg : 'try again!'});
                }
                // success return a successful json object
                callback({ code : 1, msg : result});
                // expire after 1 day
                client.EXPIRE(bottleId, 86400);
           });
        });

    });    
};
exports.pick = function (info, callback) {
   client3.SELECT(3, function (){
       client3.GET(info.user, function (err, result) {
           if(result >= 10) {
               return callback({code: 0, msg: 'you have pick 10 battles today!'});
           }
           client3.INCR(info.user, function () {
               client3.TTL(info.user, function (err, ttl) {
                   if(ttl == -1) {
                       client3.EXPIRE(info.user, 86400);
                   }
               });
           });

       });
       
       if(Math.random() <= 0.2) {
           return callback({code : 0, msg : 'starfish'});
       }
       var type = {all : Math.round(Math.random()), male: 0, femal: 1};
       info.type = info.type || 'all';
       client.SELECT(type[info.type], function () {
           client.RANDOMKEY(function (err, bottleId) {
               if(!bottleId) {
                   return callback({code: 0, msg: 'starfish!'});
               }
               client.HGETALL(bottleId, function (err, bottle) {
                    if(err) {
                        return callback({code: 0, msg: 'the bottle is broken!'});
                    }
                    callback({code: 1, msg: bottle});
                    client.DEL(bottleId);
               });
           });

       });
   });
};

exports.throwBack = function (bottle, callback) {
    var type = {male : 0, female : 1};
    var bottleId = Math.random().toString(16);
    client.SELECT(type[bottle.type], function () {
        client.HMSET(bottleId, bottle, function (err, result) {
            if(err) {
                return callback({code: 0, msg: 'try again!'});
            }
            callback({code: 1, msg: result});
            client.PEXPIRE(bottleId, bottle.time + 86400000 - Date.now());
        });
    });
};
