"use strict";

var JumpTask,

    BotTask = require('../BotTask');

JumpTask = function () {
    BotTask.apply(this, arguments);

    this.name = 'Jump Once';
};

JumpTask.prototype = new BotTask();

JumpTask.prototype.step = function (done) {
    var bot = this.app.bot;

    bot.setControlState('jump', true);
    bot.setControlState('jump', false);

    this.completed = true;

    done();
};

module.exports = JumpTask;