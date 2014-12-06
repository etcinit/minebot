"use strict";

var NavigateTask,

    BotTask = require('../BotTask');

NavigateTask = function (app, target) {
    // Call parent constructor
    BotTask.apply(this, arguments);

    if (target) {
        this.targetPosition = target;
    }

    this.name = 'NavigateTask';
};

NavigateTask.prototype = new BotTask();

NavigateTask.prototype.step = function (done) {
    var bot = this.app.bot,
        self = this;

    if (this.targetPosition) {
        bot.chat('Navigating...');
    } else if (this.app.kb.facts.has('LastDigTarget')) {
        bot.chat('Picking up stuff...');

        this.targetPosition = this.app.kb.facts.get('LastDigTarget').position;
    }

    bot.scaffold.to(this.targetPosition, function (err) {
        if (err) {
            bot.chat('Unable to reach target');
            self.completed = true;
            done(err, null);
            return;
        }

        bot.chat('Made it');
        self.completed = true;
        done(null, true);
    });
};

module.exports = NavigateTask;