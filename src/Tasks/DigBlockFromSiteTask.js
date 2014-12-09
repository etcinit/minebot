"use strict";

var DigBlockFromSiteTask,

    BotTask = require('../BotTask'),
    DigBlockTask = require('./DigBlockTask'),
    FindTargetBlockTask = require('./FindTargetBlockTask'),
    NavigateTask = require('./NavigateTask');

DigBlockFromSiteTask = function (app, sitePosition, type) {
    var navTask,
        findBlockTask,
        digTask,
        navAfterTask;

    BotTask.apply(this, arguments);

    this.name = 'Dig Block From Site';

    this.sitePosition = sitePosition;

    // Create sub tasks
    navTask = new NavigateTask(this.app, this.sitePosition, 3);
    findBlockTask = new FindTargetBlockTask(this.app, type);
    digTask = new DigBlockTask(this.app);
    navAfterTask = new NavigateTask(this.app);

    this.subTasks.push(navTask);
    this.subTasks.push(findBlockTask);
    this.subTasks.push(digTask);
    this.subTasks.push(navAfterTask);
};

DigBlockFromSiteTask.prototype = new BotTask();

DigBlockFromSiteTask.prototype.step = function (done) {
    this.completed = true;

    done();
};

module.exports = DigBlockFromSiteTask;