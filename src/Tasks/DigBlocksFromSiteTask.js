"use strict";

var DigBlocksFromSiteTask,

    BotTask = require('../BotTask'),
    DigBlockFromSiteTask = require('./DigBlockFromSiteTask');

DigBlocksFromSiteTask = function (app, sitePosition, type, count) {
    BotTask.apply(this, arguments);

    this.name = 'Find a certain amount fo blocks near the resource site';

    this.targetPosition = sitePosition;

    this.targetType = type;

    this.targetCount = count || 1;
};

DigBlocksFromSiteTask.prototype = new BotTask();

DigBlocksFromSiteTask.prototype.step = function (done) {
    var bot = this.app.bot,
        currentCount = 0;

    // Compute how many items of the type we have already in the inventory
    bot.inventory.items().forEach(function (item) {
        if (item.type === this.targetType) {
            currentCount += item.count;
        }
    }.bind(this));

    if (currentCount >= this.targetCount) {
        this.completed = true;

        done();

        return;
    }

    this.subTasks.push(new DigBlockFromSiteTask(this.app, this.targetPosition, this.targetType));

    done();
};

module.exports = DigBlocksFromSiteTask;