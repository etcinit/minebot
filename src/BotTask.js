"use strict";

var BotTask;

/**
 * Construct a bot task
 *
 * @param bot {MineBot}
 * @constructor
 */
BotTask = function (bot) {
    this.bot = bot;

    this.subTasks = [];

    this.completed = false;

    this.name = 'defaultTask';
};

/**
 * Attempt to perform a step of this task
 *
 * @param done [Function] - Callback function for when the step is done
 */
BotTask.prototype.step = function (done) {
    // Default behavior is to do nothing
    this.completed = true;

    done();
};

/**
 * Get whether all dependencies for performing this task are satisfied
 *
 * @returns {boolean}
 */
BotTask.prototype.isSatisfied = function () {
    // The default behavior is to check that all sub-tasks are met
    if (this.subTasks.length > 0) {
        this.subTasks.forEach(function (subTask) {
            if (!subTask.isSatisfied()) {
                return false;
            }
        });
    }

    return true;
};

/**
 * Get the priority of this task (1-10)
 *
 * @returns {number}
 */
BotTask.prototype.getPriority = function () {
    return 10;
};

/**
 * Get whether or not the task has been completed
 *
 * @returns {boolean}
 */
BotTask.prototype.isCompleted = function () {
    return this.completed;
};

/**
 * Return the name of the task
 *
 * @returns {string}
 */
BotTask.prototype.getName = function () {
    return this.name;
};

/**
 * Get all sub-tasks
 *
 * @returns {Array.<BotTask>}
 */
BotTask.prototype.getSubTasks = function () {
    return this.subTasks;
};

/**
 * Get list of sub-tasks that have satisfied requirements and are not completed
 *
 * @returns {Array.<BotTask>}
 */
BotTask.prototype.getResolvableTasks = function () {
    return this.subTasks.filter(function (subTask) {
        return subTask.isSatisfied() && !subTask.isCompleted();
    });
};

module.exports = BotTask;