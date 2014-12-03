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

    // Use KB if possible
    if (this.app.kb.facts.has('DigTarget')) {
        this.target = target = this.app.kb.facts.get('DigTarget');
    }

    if (target && bot.canDigBlock(target)) {
        bot.chat("Starting to dig " + target.name);
        bot.dig(target, function () {
            bot.chat('Finished digging');

            if (this.app.kb.facts.has('DigTarget')) {
                this.app.kb.facts.remove('DigTarget');
            }

            self.completed = true;

            done();
        }.bind(this));
    } else {
        bot.chat("Unable to dig target");

        if (this.app.kb.facts.has('DigTarget')) {
            this.app.kb.facts.remove('DigTarget');
        }

        self.completed = true;

        done();
    }
};

module.exports = DigBlockTask;