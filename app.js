var express = require('express'),
    redis = require('./models/redis.js');

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
    });
});
// throw back a battle
app.post('/back', function (req, res) {
    redis.throwBack(req.body, function (result) {
        res.json(result);
    });
});

app.listen(3000);
