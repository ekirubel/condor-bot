'use strict';

var CondorBot = require('../lib/condorbot');
var KarmaBot = require('../lib/karmabot');


var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;
var db_url = process.env.MONGODB_URI;

var karmabot = new KarmaBot({
    token: token,
    name: name,
    db_url: db_url
});
