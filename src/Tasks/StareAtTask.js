"use strict";

var StareAtTask,

    BotTask = require('../BotTask');

StareAtTask = function () {
    BotTask.apply(this, arguments);

    this.name = 'Stare At';
};

StareAtTask.prototype = new BotTask();

StareAtTask.prototype.step = function (done) {
    var bot = this.app.bot,
        target;

    if (this.app.kb.facts.has('StareTarget')) {
        target = this.app.kb.facts.get('StareTarget');

        bot.lookAt(target.position.offset(0, target.height, 0));
    }

    this.completed = true;

    done();
};

module.exports = StareAtTask;