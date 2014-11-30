"use strict";

var BotTask;

/**
 * Construct a bot task
 *
 * @param app {MineBot}
 * @constructor
 */
BotTask = function (app) {
    this.app = app;

    this.subTasks = [];

    this.completed = false;

    this.name = 'defaultTask';

    this.id = this.generateGUID();

    this.stepCount = 0;

    this.processing = false;
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
    var result = true;

    // The default behavior is to check that all sub-tasks are met
    if (this.subTasks.length > 0) {
        this.subTasks.every(function (subTask) {
            if (!subTask.isSatisfied() || !subTask.isCompleted()) {
                result = false;
                return false;
            }
        });
    }

    return result;
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

/**
 * Get next task that should be executed
 */
BotTask.prototype.getNext = function () {
    // If the task is satisfied, then return itself
    if (this.isSatisfied()) {
        return this;
    }

    var resolvable = this.subTasks
        .filter(function (subTask) {
            return !subTask.isCompleted();
        })
        .sort(function (a, b) {
            if (a.getPriority() < b.getPriority()) {
                return -1;
            }

            if (a.getPriority() > b.getPriority()) {
                return 1;
            }

            return 0;
        });

    if (resolvable.length < 1) {
        return null;
    }

    return resolvable[0].getNext();
};

/**
 * Adds a subtask
 *
 * @param task BotTask
 */
BotTask.prototype.push = function (task) {
    this.subTasks.push(task);
};

/**
 * Generate a GUID
 */
BotTask.prototype.generateGUID = function () {
    var guid = (function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        };
    })();

    return guid;
};

module.exports = BotTask;