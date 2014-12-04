"use strict";

var AttackRule,

    ensure = require('ensure.js'),

    BotRule = require('../BotRule'),
    AttackTask = require('../Tasks/AttackTask'),
    NavigateTask = require('../Tasks/NavigateTask');

AttackRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Attack Rule';
};

AttackRule.prototype = new BotRule();

AttackRule.prototype.getDependencies = function () {
    return ['Attacker'];
};

AttackRule.prototype.isApplicable = function (facts) {
    // Execute every time
    return true;
};

AttackRule.prototype.execute = function (facts, taskQueue) {
    var attacker = facts.get('Attacker'),
        bot = this.app.bot,
        targetPosition;

    // Simple strategy, attack or run depending on health
    if (bot.health > 9) {
        taskQueue.push(new AttackTask(this.app, attacker));
    } else {
        // Run away
        targetPosition = attacker.position.offset(20, 0, 0);

        taskQueue.push(new NavigateTask(this.app, targetPosition));
    }
};

module.exports = AttackRule;