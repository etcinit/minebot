"use strict";

var CommandRule,

    ensure = require('ensure.js'),

    BotRule = require('../BotRule'),
    BlockTypes = require('../Enums/BlockTypes'),
    JumpTask = require('../Tasks/JumpTask'),
    EquipBlockTask = require('../Tasks/EquipBlockTask'),
    GamemodeTask = require('../Tasks/GamemodeTask');

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
        ['jump', 'equipDirt', 'equipStone', 'equipSand', 'getCreative', 'becomeSurvivalist']
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
    case 'equipDirt':
        taskQueue.push(new EquipBlockTask(this.app, BlockTypes.DIRT));
        break;
    case 'equipStone':
        taskQueue.push(new EquipBlockTask(this.app, BlockTypes.STONE));
        break;
    case 'equipSand':
        taskQueue.push(new EquipBlockTask(this.app, BlockTypes.SAND));
        break;
    case 'getCreative':
        taskQueue.push(new GamemodeTask(this.app, 1));
        break;
    case 'becomeSurvivalist':
        taskQueue.push(new GamemodeTask(this.app, 0));
        break;
    }
};

module.exports = CommandRule;