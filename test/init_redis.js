var request = require('request');

for(var i = 1; i <= 5; i++) {
    (function () {
        request.post({
            url : 'http://127.0.0.1:3000',
            json : {'owner' : 'bottle' + i, 'type' : "male", 'content': 'content' + 1}
        });
    } ());
}

for(var i = 6; i <= 10; i++) {
    (function () {
        request.post({
            url : 'http://127.0.0.1:3000',
            json : {'owner' : 'bottle' + i, 'type': 'female', 'content' : 'content' + i}
        });
    } ());
}
