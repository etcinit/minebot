"use strict";

var StareAtRule,

    _ = require('lodash'),

    BotRule = require('../BotRule'),
    StareAtTask = require('../Tasks/StareAtTask');

StareAtRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Stare At Rule';
};

StareAtRule.prototype = new BotRule();

StareAtRule.prototype.getDependencies = function () {
    return ['LastToTalk'];
};

StareAtRule.prototype.isApplicable = function (facts) {
    if (facts.has('StareTarget')) {
        if (facts.has('StareMessage') && facts.has('ChatMessage')) {
            return facts.get('StareMessage') !== facts.get('ChatMessage');
        }

        return facts.get('StareTarget').username !== facts.get('LastToTalk').username;
    } else {
        return true;
    }
};

StareAtRule.prototype.execute = function (facts, taskQueue) {
    facts.set('StareTarget', facts.get('LastToTalk'));

    if (facts.has('ChatMessage')) {
        facts.set('StareMessage', facts.get('ChatMessage'));
    }

    taskQueue.push(new StareAtTask(this.app));
};

module.exports = StareAtRule;