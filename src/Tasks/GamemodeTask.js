"use strict";

var GamemodeTask,

    BotTask = require('../BotTask');

GamemodeTask = function (app, targetMode) {
    BotTask.apply(this, arguments);

    this.name = 'Change game mode';

    this.targetMode = targetMode || 0;
};

GamemodeTask.prototype = new BotTask();

GamemodeTask.prototype.step = function (done) {
    var bot = this.app.bot;

    bot.chat('/gamemode ' + this.targetMode);
    bot.chat('Changed my game mode to ' + this.targetMode);

    this.completed = true;

    done();
};

module.exports = GamemodeTask;