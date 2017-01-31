'use strict';

var CondorBot = require('../lib/condorbot');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;

var condorbot = new CondorBot({
    token: token,
    name: name
});
