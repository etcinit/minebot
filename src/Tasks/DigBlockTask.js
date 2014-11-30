"use strict";

var DigBlockTask,

    BotTask = require('../BotTask');

DigBlockTask = function (app, target) {
    BotTask.apply(this, arguments);

    this.target = target;

    this.name = 'DigBlockTask';
};

DigBlockTask.prototype = new BotTask();

DigBlockTask.prototype.step = function (done) {
    var bot = this.app.bot,
        self = this,
        target = this.target;

    if (target && bot.canDigBlock(target)) {
        bot.chat("Starting to dig " + target.name);
        bot.dig(target, function () {
            bot.chat('Finished digging');

            self.completed = true;

            done();
        }.bind(this));
    } else {
        bot.chat("Unable to dig target");

        self.completed = true;

        done();
    }
};

module.exports = DigBlockTask;