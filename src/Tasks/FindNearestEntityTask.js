"use strict";

var FindNearestEntityTask,

    BotTask = require('../BotTask');

FindNearestEntityTask = function (app, entityType) {
    BotTask.apply(this, arguments);

    this.name = 'Find nearest entity';

    this.entityType = entityType;
};

FindNearestEntityTask.prototype = new BotTask();

FindNearestEntityTask.prototype.step = function (done) {
    var bot = this.app.bot,

        id,
        entity,
        dist,
        best = null,
        bestDistance = null;

    // Scan all nearby entities and select the closest
    for (id in bot.entities) {
        entity = bot.entities[id];

        if (this.entityType && entity.type !== this.entityType) {
            continue;
        }

        if (entity === bot.entity) {
            continue;
        }

        dist = bot.entity.position.distanceTo(entity.position);

        if (!best || dist < bestDistance) {
            best = entity;
            bestDistance = dist;
        }
    }

    this.app.kb.facts.set('NearestEntity', best);

    this.completed = true;

    done();
};

module.exports = FindNearestEntityTask;