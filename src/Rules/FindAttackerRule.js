"use strict";

var FindAttackerRule,

    ensure = require('ensure.js'),

    BotRule = require('../BotRule'),
    EntityTypes = require('../Enums/EntityTypes'),
    FindNearestEntityTask = require('../Tasks/FindNearestEntityTask');

FindAttackerRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Find attacker when attacked rule';
};

FindAttackerRule.prototype = new BotRule();

FindAttackerRule.prototype.getDependencies = function () {
    return ['UnderAttack'];
};

FindAttackerRule.prototype.isApplicable = function (facts) {
    return facts.get('UnderAttack') === true;
};

FindAttackerRule.prototype.execute = function (facts, taskQueue) {
    if (facts.has('NearestEntity')) {
        if (facts.has('FindingNearestEnemy')) {
            facts.scheduleRemove('FindingNearestEnemy');

            facts.set('Attacker', facts.get('NearestEntity'));
        }
    } else {
        // Find the nearest entity
        facts.setTrue('FindingNearestEnemy');

        taskQueue.push(new FindNearestEntityTask(this.app, EntityTypes.MOB));
    }

    facts.scheduleRemove('UnderAttack');
};

module.exports = FindAttackerRule;