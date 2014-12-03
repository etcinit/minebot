"use strict";

var DigBlockFromSiteRule,

    BotRule = require('../BotRule'),
    DigBlockFromSiteTask = require('../Tasks/DigBlockFromSiteTask');

DigBlockFromSiteRule = function () {
    BotRule.apply(this, arguments);

    this.name = 'Dig Block From Site Command Rule';
};

DigBlockFromSiteRule.prototype = new BotRule();

DigBlockFromSiteRule.prototype.getDependencies = function () {
    return ['ChatMessage', 'ResourceSite'];
};

DigBlockFromSiteRule.prototype.isApplicable = function (facts) {
    return facts.get('ChatMessage') === 'digDirtFromSite';
};

DigBlockFromSiteRule.prototype.execute = function (facts, taskQueue) {
    facts.scheduleRemove('ChatMessage');

    var sitePosition = facts.get('ResourceSite');

    taskQueue.push(new DigBlockFromSiteTask(this.app, sitePosition));
};

module.exports = DigBlockFromSiteRule;