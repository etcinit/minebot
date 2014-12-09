"use strict";

var BuildColumnTask,

    BotTask = require('../BotTask'),
    BlockTypes = require('../Enums/BlockTypes'),
    DigBlocksFromSite = require('./DigBlocksFromSiteTask'),
    NavigateTask = require('./NavigateTask'),
    PlaceBlockUnder = require('./PlaceBlockUnderTask');

BuildColumnTask = function (app, targetPosition) {
    BotTask.apply(this, arguments);

    this.name = 'Build column';

    this.columnHeight = 3;

    this.state = 'init';

    this.initialHeight = 0;
    this.targetHeight = 3;

    this.targetType = BlockTypes.DIRT;

    this.targetPosition = targetPosition;
};

BuildColumnTask.prototype = new BotTask();

BuildColumnTask.prototype.step = function (done) {
    var bot = this.app.bot,
        kb = this.app.kb,
        digTask,
        navTask,
        currentCount = 0,
        i;

    switch (this.state) {
    case 'init':
        // Set initial dig and navigation tasks.
        // We need to collect enough blocks to build the column
        this.initialHeight = bot.entity.position.y;
        this.targetHeight = this.initialHeight + this.columnHeight;

        this.state = 'digging';
        break;
    case 'digging':
        digTask = new DigBlocksFromSite(this.app, kb.facts.get('ResourceSite'), this.targetType, this.columnHeight);

        navTask = new NavigateTask(this.app, this.targetPosition);
        navTask.subTasks.push(digTask);

        this.subTasks.push(navTask);

        this.state = 'building';
        break;
    case 'building':
        // We might have used too many blocks to get back so we might need
        // to go back a get more
        bot.inventory.items().forEach(function (item) {
            if (item.type === this.targetType) {
                currentCount += item.count;
            }
        }.bind(this));

        // If less than needed, go back
        if (currentCount < this.columnHeight) {
            bot.chat('Seems like I still don\'t have enough blocks. Let me go back');

            this.state = 'digging';

            break;
        }

        for (i = 0; i < this.targetHeight - this.initialHeight; i++) {
            this.subTasks.push(new PlaceBlockUnder(this.app));
        }

        this.state = 'finished';

        break;
    case 'finished':
        bot.chat('Built a column. So proud');

        this.completed = true;

        break;
    }

    done();
};

module.exports = BuildColumnTask;