var express = require('express'),
    redis = require('./models/redis.js'),
    mongodb = require('./models/mongodb.js');

var app = express();
app.use(express.bodyParser());

// throw a bottle
app.post('/', function (req, res) {
    if(!(req.body.owner && req.body.type && req.body.content)) {
        return res.json({code : 0, msg : 'the message is not completed!'});
    }
    redis.throw(req.body, function (json) {
        res.json(json);
    });
});

// pick up a bottle
app.get('/', function (req, res) {
    if(!req.query.user) {
        return res.json({code : 0, msg : 'the message is not completed!'});
    }
    redis.pick(req.query, function (result) {
        res.json(result);
        if(result.code == 1) {
            mongodb.save(req.query.user, result.msg);
        }
    });
});
// throw back a battle
app.post('/back', function (req, res) {
    redis.throwBack(req.body, function (result) {
        res.json(result);
    });
});

app.get('/user/:user', function (req, res) {
    mongodb.getAll(req.params.user, function (result) {
        res.json(result);
    });
});

app.get('/bottle/:_id', function (req, res) {
    mongodb.getOne(req.params._id, function (result) {
        res.json(result);
    });
});

app.post('/reply/:_id', function (req ,res) {
    if(!(req.body.user && req.body.content)) {
        return callback({code: 0, msg: 'replay is not completed!'});
    }
    mongodb.reply(req.params._id, req.body, function (result) {
       res.json(result);
    });
});

app.get('/delete/:_id', function (req, res) {
    mongodb.delete(req.params._id, function (result) {
        res.json(json);
    });
});

app.listen(3000);
