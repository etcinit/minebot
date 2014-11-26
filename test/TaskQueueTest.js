"use strict";

var TaskQueue = require('../src/TaskQueue'),

    BotTask = require('../src/BotTask'),
    sinon = require('sinon');

describe('TaskQueue', function () {
    var mockBot = {};

    it('should be a constructor', function () {
        var queue = new TaskQueue();
    });

    describe('count', function () {
        it('should return zero when no tasks', function () {
            var queue = new TaskQueue();

            queue.count().should.be.equal(0);
        });

        it('should return 1 when 1 tasks', function () {
            var queue = new TaskQueue();

            queue.push(new BotTask(mockBot));

            queue.count().should.be.equal(1);
        });
    });

    describe('getNext', function () {
        it('should return null when no tasks', function () {
            var queue = new TaskQueue();

            (queue.getNext() === null).should.be.true;
        });

        it('should return the only task when one task', function () {
            var queue = new TaskQueue();

            queue.push(new BotTask(mockBot));

            queue.getNext().should.be.instanceOf(BotTask);
        });

        it('should return the highest priority task', function () {
            var queue = new TaskQueue(),
                task1 = new BotTask(mockBot),
                task2 = new BotTask(mockBot),

                getPriority1,
                getPriority2;

            getPriority1 = sinon.stub(task1, 'getPriority');
            getPriority2 = sinon.stub(task2, 'getPriority');

            getPriority1.onCall(1).returns(100);
            getPriority2.onCall(1).returns(10);

            queue.push(task1);
            queue.push(task2);

            queue.getNext().should.be.instanceOf(BotTask);

            queue.getNext().should.be.equal(task1);
            queue.getNext().should.not.be.equal(task2);
        });

        it('should return the highest priority task (with subtasks)', function () {
            var queue = new TaskQueue(),
                task1 = new BotTask(mockBot),
                task2 = new BotTask(mockBot),
                subtask = new BotTask(mockBot),

                getPriority1,
                getPriority2;

            getPriority1 = sinon.stub(task1, 'getPriority');
            getPriority2 = sinon.stub(task2, 'getPriority');

            getPriority1.onCall(1).returns(100);
            getPriority2.onCall(1).returns(10);

            task1.push(subtask);

            queue.push(task1);
            queue.push(task2);

            queue.getNext().should.be.instanceOf(BotTask);

            queue.getNext().should.be.equal(subtask);
            queue.getNext().should.not.be.equal(task1);
            queue.getNext().should.not.be.equal(task2);
        });
    });
});