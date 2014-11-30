"use strict";

var MineBot,

    TaskQueue = require('./TaskQueue'),
    BlockBase = require('./KnowledgeBase/BlockBase'),

    JumpTask = require('./Tasks/JumpTask'),
    NavigateTask = require('./Tasks/NavigateTask'),
    DigBlockTask = require('./Tasks/DigBlockTask'),

    mineflayer = require('mineflayer'),
    blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer),
    navigationPlugin = require('mineflayer-navigate')(mineflayer),
    scaffoldPlugin = require('mineflayer-scaffold')(mineflayer),
    blockTypes = require('./Enums/BlockTypes');

MineBot = function (host, port) {
    // Initialize the bot
    this.bot = mineflayer.createBot({
        username: "minebot",
        host: host || "localhost", // optional
        port: port || 60451
    });

    // Init task queue
    this.queue = new TaskQueue();
    this.taskLoop();

    // Setup plugins
    blockFinderPlugin(this.bot);
    navigationPlugin(this.bot);
    scaffoldPlugin(this.bot);

    // Setup state tracking variables
    this.lastHealth = -1;
    this.lastToTalk = null;

    // Alias for bot
    var bot = this.bot;

    // Setup event handling
    bot.on('chat', function (username, message) {
        var entity;

        this.lastToTalk = this.bot.players[username].entity;
        this.stareAt();

        // Ignore own chats
        if (username === bot.username) return;

        if (message === 'jump') {
            //bot.setControlState('jump', true);
            //bot.setControlState('jump', false);
            console.log(this.lastToTalk.position);
            this.queue.push(new JumpTask(this));
        } else if (message === 'come') {
            this.queue.push(new NavigateTask(this, this.lastToTalk.position));
        } else if (message === 'forward') {
            bot.setControlState('forward', true);
        } else if (message === 'back') {
            bot.setControlState('back', true);
        } else if (message === 'left') {
            bot.setControlState('left', true);
        } else if (message === 'right') {
            bot.setControlState('right', true);
        } else if (message === 'stop') {
            bot.clearControlStates();
        } else if (message === 'mount') {
            entity = nearestEntity("object");
            bot.mount(entity);
        } else if (message === 'dismount') {
            bot.dismount();
        } else if (message === 'attack') {
            this.attackNearest();
        } else if (message === 'tp') {
            bot.entity.position.y += 10;
        } else if (message === 'spawn') {
            bot.spawn();
        } else if (message === 'pos') {
            bot.chat(bot.entity.position.toString());
        } else if (message === 'yp') {
            bot.chat("Yaw " + bot.entity.yaw + ", pitch: " + bot.entity.pitch);
        } else if (message === 'sprint') {
            bot.setControlState('sprint', true);
        } else if (message === 'findDirt') {
            bot.findBlock({
                point: bot.entity.position,
                matching: blockTypes.GRASS,
                maxDistance: 256,
                count: 1
            }, function(err, blockPoints) {
                if (blockPoints.length > 0) {
                    this.dig(blockPoints[0]);
                }
            }.bind(this));
        }
    }.bind(this));

    bot.on('health', function () {
        if (this.lastHealth == -1) {
            this.lastHealth = bot.health;
            return;
        }

        if (this.lastHealth > bot.health) {
            this.attackNearest();
        }
    }.bind(this));
};

MineBot.prototype.stareAt = function () {
    if (!this.lastToTalk) {
        return;
    }

    this.bot.lookAt(this.lastToTalk.position.offset(0, this.lastToTalk.height, 0));

    setTimeout(this.stareAt.bind(this), 1000);
};

/**
 * Attack the closest entity (could be anything)
 */
MineBot.prototype.attackNearest = function () {
    var entity = this.getNearestEntity();

    this.bot.attack(entity);
};

/**
 * Attempt to dig the target block
 *
 * @param target
 */
MineBot.prototype.dig = function (target, callback) {
    if (this.bot.targetDigBlock) {
        this.bot.chat("Already digging " + bot.targetDigBlock.name);
    } else {
        //if (target && this.bot.canDigBlock(target)) {
        //    this.bot.chat("Starting to dig " + target.name);
        //    this.bot.dig(target, function () {
        //        this.bot.chat('Finished digging');
        //
        //        if (callback) {
        //            callback();
        //        }
        //    }.bind(this));
        //} else {
        //    this.bot.chat("Unable to dig target");
        //}
        this.queue.push(new DigBlockTask(this, target));
    }
};

/**
 * Find the nearest entity (type is optional)
 *
 * @param [entityType]
 * @returns {*}
 */
MineBot.prototype.getNearestEntity = function (entityType) {
    var id,
        entity,
        dist,
        best = null,
        bestDistance = null;

    // Scan all nearby entities and select the closest
    for (id in this.bot.entities) {
        entity = this.bot.entities[id];

        if (entityType && entity.type !== entityType) {
            continue;
        }

        if (entity === this.bot.entity) {
            continue;
        }

        dist = this.bot.entity.position.distanceTo(entity.position);

        if (!best || dist < bestDistance) {
            best = entity;
            bestDistance = dist;
        }
    }

    return best;
};

MineBot.prototype.taskLoop = function () {
    var task = null,
        self = this;

    task = this.queue.step(function () {

    });

    setTimeout(self.taskLoop.bind(self), 400);
};

module.exports = MineBot;