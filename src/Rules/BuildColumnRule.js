"use strict";

var BuildColumnRule,

    _ = require('lodash'),

    BotRule = require('../BotRule'),
    ChatTask = require('../Tasks/ChatTask'),
    BuildColumnTask = require('../Tasks/BuildColumnTask');

BuildColumnRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Build Column Rule';
};

BuildColumnRule.prototype = new BotRule();

BuildColumnRule.prototype.getDependencies = function () {
    return ['LastToTalk', 'ChatMessage'];
};

BuildColumnRule.prototype.isApplicable = function (facts) {
    return facts.get('ChatMessage') === 'buildColumn';
};

BuildColumnRule.prototype.execute = function (facts, taskQueue) {
    facts.scheduleRemove('ChatMessage');

    var player = facts.get('LastToTalk');

    if (!facts.has('ResourceSite')) {
        taskQueue.push(new ChatTask(this.app, 'I need to know where to dig from first'));

        return;
    }

    facts.set('ColumnSite', player.position.clone());

    taskQueue.push(new ChatTask(this.app, 'Got that! I\'ll build a column here'));

    taskQueue.push(new BuildColumnTask(this.app, player.position.clone()));
};

module.exports = BuildColumnRule;