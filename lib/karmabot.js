'use strict';

var CondorBot = require('../lib/condorbot');
var MongoDB = require('../lib/mongo');

class KarmaBot extends CondorBot {

    constructor(params) {
        super(params);
        this.dbClient = new MongoDB(params.db_url);
        this.karmaRegex = /<@([0-9A-Za-z]+)>(:\s?|\s?)?(\+\+|\-\-)/g;
        this.on('start', this. _onStart);
        this.on('message', this._onMessage);
    }

    /**
     * On Start callback, called when the bot connects to the Slack server and access the channel
     */
    _onStart() {
        this._loadBotUser();
        this._sayHiDebug();
    }

    /**
     * On message callback, called when a message (of any type) is detected with the real time messaging API
     */
    _onMessage(message) {
        if (this._isRelevantKarmaUpdateMessage(message)) {
            this._adjustKarma(message);
        } else if (this._isRelevantKarmaLeaderboardMessage(message)) {
            this._showLeaderboard(message);
        }
    }


    /**
     * Adjust the karma for a user. Ethier +1 or -1
     */
    _adjustKarma(message) {
        var match = this.karmaRegex.exec(message.text);
        // ID for the user who's karma is being modified
        var id = match[1];
        if (message.user != id) {
            // ++ or --
            var sign = match[3];
            var amount = sign === '++' ? 1 : -1;

            this.dbClient.upsert("user-data", id, {$inc: {karma: amount}})
        } else {
            var channel = this._getChannelById(message.channel);
            this.giphy.sendMessageWithGiphy(this, "smh bruh \n", 'smh', channel.name);
        }
    }

    /**
     * Sends a message containing the karma leaderboard. Only shows top 5
     */
     _showLeaderboard(message){
         var query = {karma: {$exists: true}};
         var fields = {karma: 1, _id: 1};
         var options = {limit: 5, sort: [['karma','desc']]}
         var self = this;

         this.dbClient.query("user-data", query, fields, options, function(results) {
             var channel = self._getChannelById(message.channel);
             var response = "The current standings are:\n";

             for (var i = 0; i < results.length; i++) {
                 var rank = (i + 1) + ". ";
                 var usr = "<@" + results[i]._id + "> ";
                 var karma = " (" + results[i].karma + " CondorKarma :tm:)\n";
                 response +=  rank + usr + karma;
             }

             self.giphy.sendMessageWithGiphy(self, response, 'w00t', channel.name);
         });
     }

    /**
     * Is this a karma update message? aka @user++ or @user--
     */
    _isRelevantKarmaUpdateMessage(originalMessage) {
        return this._isRelevantMessage(originalMessage)
            && originalMessage.text.match(this.karmaRegex);
    }

    /**
     * Is this a leaderboard message? aka '@condorbot leaderboard'
     */
     _isRelevantKarmaLeaderboardMessage(originalMessage) {
         return this._isRelevantMessage(originalMessage)
            && (originalMessage.text === '<@' + this.user.id + '> leaderboard');
     }
}

module.exports = KarmaBot;
