"use strict";

var FindTargetBlockTask,

    BotTask = require('../BotTask'),
    BlockTypes = require('../Enums/BlockTypes');

FindTargetBlockTask = function (type) {
    BotTask.apply(this, arguments);

    this.name = 'Find target block task';

    this.type = BlockTypes.GRASS;
};

FindTargetBlockTask.prototype = new BotTask();

FindTargetBlockTask.prototype.step = function (done) {
    var bot = this.app.bot,
        facts = this.app.kb.facts;

    bot.findBlock({
        point: bot.entity.position,
        matching: this.type,
        maxDistance: 256,
        count: 1
    }, function(err, blockPoints) {
        if (blockPoints.length > 0) {
            facts.set('DigTarget', blockPoints[0]);
            console.log(blockPoints[0]);
        }

        this.completed = true;

        done();
    }.bind(this));
};

module.exports = FindTargetBlockTask;