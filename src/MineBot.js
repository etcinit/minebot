"use strict";

var MineBot,

    TaskQueue = require('./TaskQueue'),
    BlockBase = require('./KnowledgeBase/BlockBase'),
    RuleEngine = require('./KnowledgeBase/RuleEngine'),
    RuleLoader = require('./RuleLoader'),

    JumpTask = require('./Tasks/JumpTask'),
    NavigateTask = require('./Tasks/NavigateTask'),
    DigBlockTask = require('./Tasks/DigBlockTask'),

    mineflayer = require('mineflayer'),
    blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer),
    navigationPlugin = require('mineflayer-navigate')(mineflayer),
    scaffoldPlugin = require('mineflayer-scaffold')(mineflayer),
    blockTypes = require('./Enums/BlockTypes');

MineBot = function (host, port) {
    var rules,
        key;

    // Initialize the bot
    this.bot = mineflayer.createBot({
        username: "minebot",
        host: host || "localhost", // optional
        port: port || 60451
    });

    // Init task queue
    this.queue = new TaskQueue();

    // Init knowledge base
    this.kb = new RuleEngine(this.queue, this);

    // Load rules
    rules = (new RuleLoader(this)).load();
    for (key in rules) {
        this.kb.registerRule(rules[key]);
    }

    // Setup plugins
    blockFinderPlugin(this.bot);
    navigationPlugin(this.bot);
    scaffoldPlugin(this.bot);

    // Setup state tracking variables
    this.lastHealth = -1;
    this.lastToTalk = null;

    // Alias for bot
    var bot = this.bot;

    this.mainLoop();

    // Setup event handling
    bot.on('chat', function (username, message) {
        var entity;

        this.lastToTalk = this.bot.players[username].entity;
        this.stareAt();

        // Perceive into the KB
        this.kb.facts.set('LastToTalk', this.lastToTalk);
        this.kb.facts.set('ChatMessage', message);

        // Ignore own chats
        if (username === bot.username) return;

        if (message === 'jump') {
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

    bot.on('entityHurt', function (entity) {
        if (entity.username && entity.username === 'minebot') {
            console.log('Ouch');
            this.kb.facts.set('UnderAttack', true);
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

MineBot.prototype.mainLoop = function () {
    var self = this;

    this.ruleLoop();
    this.taskLoop();

    setTimeout(self.mainLoop.bind(self), 400);
};

MineBot.prototype.taskLoop = function () {
    var task = null;

    task = this.queue.step(function () {

    });
};

MineBot.prototype.ruleLoop = function () {
    this.kb.step();
};

module.exports = MineBot;