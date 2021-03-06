"use strict";

var AttackTask,

    BotTask = require('../BotTask');

AttackTask = function (app, target) {
    BotTask.apply(this, arguments);

    this.name = 'Attack entity once';

    this.target = target;
};

AttackTask.prototype = new BotTask();

AttackTask.prototype.step = function (done) {
    var bot = this.app.bot;

    bot.attack(this.target);
    bot.lookAt(this.target.position.offset(0, this.target.height, 0));

    this.completed = true;

    done();
};

module.exports = AttackTask;