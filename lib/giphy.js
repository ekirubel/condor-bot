"use strict";

var request = require('request');

class Giphy {

    /**
     * Decorates a bot message with a gif from giphy
     */
    sendMessageWithGiphy(bot, message, term, channel) {
        request("http://api.giphy.com/v1/gifs/search?q=" + term + "&api_key=dc6zaTOxFJmzC", function (error, response, body){
            var data = JSON.parse(body);

            var max = data.data.length;
            var min = 0;

            var randomNumber = Math.floor(Math.random() * (max - min)) + min;

            message += "\n" + data.data[randomNumber].images.downsized.url;


            bot.postMessageToChannel(channel, message, bot.postAs);
        });
    }
}

module.exports = Giphy;
