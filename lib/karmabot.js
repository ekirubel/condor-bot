'use strict';

var CondorBot = require('../lib/condorbot');
var MongoDB = require('../lib/mongo');

class KarmaBot extends CondorBot {

    constructor(params) {
        super(params);
        this.dbClient = new MongoDB(params.db_url);
        this.karmaRegex = /<@([0-9A-Za-z]+)>(:\s?|\s?)?(\+\+|\-\-)/g;

        this.on('start',this. _onStart);
        this.on('message', this._onMessage);
    }

    /**
     * Adjust the karma for a user. Ethier +1 or -1
     * @param
     */
    _adjustKarma(message) {
        console.log(message);
        var match = this.karmaRegex.exec(message.text);
        // ID for the user who's karma is being modified
        var id = match[1];
        if (message.user != id) {
            // ++ or --
            var sign = match[3];
            var amount = sign === '++' ? 1 : -1;

            this.dbClient.upsert("user-data", id, {$inc: {karma: amount}})
        }
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
        } else if (true) {

        }
    }

    /**
     * Is this a karma update message? aka @user++ or @user--
     */
    _isRelevantKarmaUpdateMessage(originalMessage) {
        return this._isRelevantMessage(originalMessage)
            && originalMessage.text.match(this.karmaRegex);
    }
}

module.exports = KarmaBot;
