"use strict";

var AttackNearestTask,

    BotTask = require('../BotTask'),
    AttackTask = require('./AttackTask'),
    ChatTask = require('./ChatTask');

AttackNearestTask = function () {
    BotTask.apply(this, arguments);

    this.name = 'Attack nearest entity';

    if (this.app.kb.facts.has('NearestEntity')) {
        this.subTasks.push(new AttackTask(this.app), this.app.kb.facts.get('NearestEntity'));
    } else {
        this.subTasks.push(new ChatTask(this.app, "I don't know who to attack :("));
    }
};

AttackNearestTask.prototype = new BotTask();

AttackNearestTask.prototype.step = function (done) {
    this.completed = true;

    done();
};

module.exports = AttackNearestTask;