"use strict";

var ChatTask,

    BotTask = require('../BotTask');

ChatTask = function (app, message) {
    BotTask.apply(this, arguments);

    this.name = 'Chat';

    this.message = message;
};

ChatTask.prototype = new BotTask();

ChatTask.prototype.step = function (done) {
    var bot = this.app.bot;

    bot.chat(this.message);

    this.completed = true;

    done();
};

module.exports = ChatTask;