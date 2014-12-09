"use strict";

var PlaceBlockTask,

    vec3 = require('vec3'),

    BotTask = require('../BotTask');

PlaceBlockTask = function (app) {
    BotTask.apply(this, arguments);

    this.name = 'Place One Block';
};

PlaceBlockTask.prototype = new BotTask();

PlaceBlockTask.prototype.step = function (done) {
    var bot = this.app.bot,
        placeIfHighEnough,
        targetBlock,
        jumpY;

    if (!bot.heldItem) {
        bot.chat('I am not holding a block right now. Cannot build');

        this.completed = true;

        done();

        return;
    }

    placeIfHighEnough = function () {
        if (bot.entity.position.y > jumpY) {
            bot.placeBlock(targetBlock, vec3(0, 1, 0));

            bot.setControlState('jump', false);

            bot.removeListener('move', placeIfHighEnough);

            this.completed = true;

            done();
        }
    }.bind(this);

    targetBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
    jumpY = bot.entity.position.y + 1;

    bot.setControlState('jump', true);

    bot.on('move', placeIfHighEnough);
};

module.exports = PlaceBlockTask;