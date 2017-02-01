'use strict';

var Bot = require('slackbots');
var Giphy = require('../lib/giphy');

class CondorBot extends Bot {

    constructor(params) {
        super(params);
        this.token = params.token;
        this.name = this.name || 'condorbot';
        this.user = null;
        this.postAs = {
            as_user: false,
            icon_emoji: ':condor:'
        };
        this.giphy = new Giphy();
    }

    /**
     * Loads actual bot user
     */
    _loadBotUser() {
        var self = this;
        this.user = this.users.filter(function (user) {
            return user.name === self.name;
        })[0];
    }

    /**
     * Sends message in debug channel to verify startup/message listening
     * Will likely be removed once actual commands are in place
     */
    _sayHiDebug(originalMessage) {
        if (originalMessage) {
            var channel = this._getChannelById(originalMessage.channel);
            this.postMessageToChannel(channel.name, "Hello in " + channel.name, params);
        } else {
            this.postMessageToChannel("jimbo-test-dev", "HI!", this.iconParams);
        }

    }

    /**
     * Util function to verify CondorBot cares about this message
     */
    _isRelevantMessage(message) {
        return this._isChatMessage(message) &&
            this._isChannelConversation(message) &&
            !this._isFromCondorBot(message);
    }

    /**
     * Util function to check if a given real time message object represents a chat message
     */
    _isChatMessage(message) {
        return message.type === 'message' && Boolean(message.text);
    }

    /**
     * Util function to check if a given real time message object is directed to a channel
     */
    _isChannelConversation(message) {
        return typeof message.channel === 'string' &&
            message.channel[0] === 'C';
    }

    /**
     * Util function to check if a given real time message is mentioning the CondorBot
     */
    _isMentioningCondorBot(message) {
        return message.text.toLowerCase().indexOf(this.name) > -1;
    }

    /**
     * Util function to check if a given real time message has ben sent by the CondorBot
     */
    _isFromCondorBot(message) {
        return message.user === this.user.id;
    }

    /**
     * Util function to get the name of a channel given its id
     */
    _getChannelById(channelId) {
        return this.channels.filter(function (item) {
            return item.id === channelId;
        })[0];
    }
}

module.exports = CondorBot;
