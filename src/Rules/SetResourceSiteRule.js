"use strict";

var SetResourceSiteRule,

    _ = require('lodash'),

    BotRule = require('../BotRule'),
    ChatTask = require('../Tasks/ChatTask');

SetResourceSiteRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Set Resource Site Rule';
};

SetResourceSiteRule.prototype = new BotRule();

SetResourceSiteRule.prototype.getDependencies = function () {
    return ['LastToTalk', 'ChatMessage'];
};

SetResourceSiteRule.prototype.isApplicable = function (facts) {
    return facts.get('ChatMessage') === 'setResourceSite';
};

SetResourceSiteRule.prototype.execute = function (facts, taskQueue) {
    facts.scheduleRemove('ChatMessage');

    var player = facts.get('LastToTalk');

    facts.set('ResourceSite', player.position.clone());

    console.log('Resources site set to: ', player.position);
    taskQueue.push(new ChatTask(this.app, 'Got that! I\'ll get materials from here'));
};

module.exports = SetResourceSiteRule;