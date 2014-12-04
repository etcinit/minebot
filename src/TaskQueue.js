"use strict";

var TaskQueue,

    ensure = require('ensure.js'),
    shield = ensure.shield,
    Nothing = ensure.Nothing,

    BotTask = require('./BotTask');

TaskQueue = function () {
    this.taskTree = [];
};

/**
 * Push a task into the queue
 *
 * @param task
 */
TaskQueue.prototype.push = function (task) {
    this.taskTree.push(task);
};

/**
 * Return main task count
 */
TaskQueue.prototype.count = function () {
    return this.taskTree.length;
};

/**
 * Execute the next logical step
 */
TaskQueue.prototype.step = shield([Function], Nothing, function (done) {
    var self = this,
        nextTask;

    nextTask = this.getNext();

    if (nextTask === null) {
        done();
        return;
    }

    if (nextTask.processing) {
        console.log('Task', nextTask.name, 'is still processing. Skipping step');
        done();
        return;
    }

    console.log('Process task', nextTask.name);

    nextTask.processing = true;

    nextTask.step(function () {
        nextTask.stepCount += 1;

        nextTask.processing = false;

        if (nextTask.completed) {
            console.log('Task', nextTask.name, 'was completed');
        }

        done.call(this, arguments);
    });
});

/**
 * Get the next task that should be performed
 *
 * @return BotTask|null
 */
TaskQueue.prototype.getNext = function () {
    var next,
        resolvable;

    // First sort by priority
    this.prioritySort();

    // Get only resolvable tasks (non-completed)
    resolvable = this.taskTree.filter(function (subTask) {
        return !subTask.isCompleted();
    });

    // Recursively try to find the next task to perform
    next = null;

    resolvable.every(function (task) {
        var possibleNext = null;

        if (task.isSatisfied()) {
            next = task;
            return false;
        }

        possibleNext = task.getNext();

        if (possibleNext != null) {
            next = possibleNext;
            return false;
        }
    });

    return next;
};

/**
 * Sort tasks by priority
 */
TaskQueue.prototype.prioritySort = function () {
    this.taskTree = this.taskTree.sort(function (a, b) {
        if (a.getPriority() > b.getPriority()) {
            return -1;
        }

        if (a.getPriority() < b.getPriority()) {
            return 1;
        }

        return 0;
    });
};

module.exports = TaskQueue;