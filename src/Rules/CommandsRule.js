"use strict";

var CommandRule,

    ensure = require('ensure.js'),

    BotRule = require('../BotRule'),
    JumpTask = require('../Tasks/JumpTask');

CommandRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Set Resource Site Rule';
};

CommandRule.prototype = new BotRule();

CommandRule.prototype.getDependencies = function () {
    return ['LastToTalk', 'ChatMessage'];
};

CommandRule.prototype.isApplicable = function (facts) {
    return ensure.isIn(
        facts.get('ChatMessage'),
        ['spawn']
    );
};

CommandRule.prototype.execute = function (facts, taskQueue) {
    facts.scheduleRemove('ChatMessage');

    var player = facts.get('LastToTalk'),
        message = facts.get('ChatMessage');

    switch (message) {
    case 'jump':
        taskQueue.push(new JumpTask(this.app));
        break;
    }
};

module.exports = CommandRule;