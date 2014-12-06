"use strict";

var EquipBlockTask,

    BotTask = require('../BotTask'),
    EquipTargets = require('../Enums/EquipTargets'),
    DigBlockFromSiteTask = require('./DigBlockFromSiteTask'),
    ChatTask = require('./ChatTask');

EquipBlockTask = function (app, targetType) {
    BotTask.apply(this, arguments);

    this.name = 'Equip block type';

    this.targetType = targetType;
};

EquipBlockTask.prototype = new BotTask();

EquipBlockTask.prototype.step = function (done) {
    var bot = this.app.bot,
        kb = this.app.kb,
        availableBlocks;

    // Check the we aren't already in the process of equiping something
    if (kb.facts.has('Equip') && kb.facts.get('Equip')) {
        done();

        return;
    }

    // Check if we are already holding the target block type
    if (bot.heldItem && bot.heldItem === this.targetType) {
        this.completed = true;

        done();

        return;
    }

    // Otherwise, check that we have the target block in the inventory
    availableBlocks = bot.inventory.items().filter(function (item) {
        return item.type === this.targetType;
    }.bind(this));

    console.log(bot.inventory.items());
    console.log(this.targetType);

    // Attempt to equip
    if (availableBlocks && availableBlocks.length > 0) {
        kb.facts.setTrue('Equip');

        bot.equip(availableBlocks[0], EquipTargets.HAND, function (err) {
            kb.facts.setFalse('Equip');

            this.completed = true;

            done();
        }.bind(this));
    } else {
        if (kb.facts.has('ResourceSite')) {
            // We need to find the target block
            this.subTasks.push(new DigBlockFromSiteTask(this.app, kb.facts.get('ResourceSite'), this.targetType));

            done();
        } else {
            this.app.queue.push(new ChatTask(this.app, 'Unable to dig. Resource site is not set'));

            this.completed = true;

            done();
        }
    }
};

module.exports = EquipBlockTask;