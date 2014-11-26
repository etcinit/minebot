"use strict";

var BotTask = require('../src/BotTask'),

    sinon = require('sinon'),
    ensure = require('ensure.js');

describe('BotTask', function () {
    var mockBot = {};

    describe('step', function () {
        it('should mark the task as completed (default behavior)', function (done) {
            var task = new BotTask(mockBot);

            task.completed.should.be.false;

            task.step(function () {
                task.completed.should.be.true;

                done();
            });
        });
    });

    describe('push', function () {
        it('should push tasks to the subtasks array', function () {
            var task = new BotTask(mockBot),
                subtask = new BotTask(mockBot);

            task.subTasks.length.should.be.equal(0);

            task.push(subtask);

            task.subTasks.length.should.be.equal(1);
        });
    });

    describe('getNext', function () {
        it('should return null if we cannot resolve any tasks', function () {
            var task = new BotTask(mockBot);

            sinon.stub(task, 'isSatisfied').returns(false);

            (task.getNext() === null).should.be.true;
        });

        it('should return itself when it is a leaf task', function () {
            var task = new BotTask(mockBot);

            (task.getNext() === null).should.be.false;

            task.getNext().should.be.equal(task);
        });

        it('should return a subtask when it is a parent task', function () {
            var task = new BotTask(mockBot),
                subtask = new BotTask(mockBot);

            task.push(subtask);

            (task.getNext() === null).should.be.false;

            task.getNext().should.be.equal(subtask);
        });
    });

    describe('isSatisfied', function () {
        it('should return true when it is a leaf task', function () {
            var task = new BotTask(mockBot);

            task.isSatisfied().should.be.true;
        });

        it('should return false when it is a parent task', function () {
            var task = new BotTask(mockBot),
                subtask = new BotTask(mockBot);

            task.push(subtask);

            task.isSatisfied().should.be.false;
        });

        it('should return true when it is a parent task and children are completed', function () {
            var task = new BotTask(mockBot),
                subtask = new BotTask(mockBot);

            task.push(subtask);

            task.isSatisfied().should.be.false;

            subtask.completed = true;

            task.isSatisfied().should.be.true;
        });
    });

    describe('getPriority', function () {
        it('should return a number between 1 and 100', function () {
            var task = new BotTask(mockBot);

            ensure.isNumber(task.getPriority()).should.be.true;

            task.getPriority().should.be.greaterThan(0);
            task.getPriority().should.be.lessThan(101);
        });
    });

    describe('isCompleted', function () {
        it('should return a boolean', function (done) {
            var task = new BotTask(mockBot);

            task.isCompleted().should.be.false;

            task.step(function () {
                task.isCompleted().should.be.true;

                done();
            })
        });
    });

    describe('getName', function () {
        it('should return a string', function () {
            var task = new BotTask(mockBot);

            ensure.isString(task.getName()).should.be.true;
        });
    });

    describe('getSubTasks', function () {
        it('should return all subtasks (even completed)', function () {
            var task = new BotTask(mockBot),
                subtask1 = new BotTask(mockBot),
                subtask2 = new BotTask(mockBot),
                result;

            task.push(subtask1);
            task.push(subtask2);

            subtask1.completed = true;

            result = task.getSubTasks();

            result.indexOf(subtask1).should.be.equal(0);
            result.indexOf(subtask2).should.be.equal(1);
        });
    });

    describe('getResolvableTasks', function () {
        it('should get all non-complete and satisfied tasks', function () {
            var task = new BotTask(mockBot),
                subtask1 = new BotTask(mockBot),
                subtask2 = new BotTask(mockBot),
                subtask3 = new BotTask(mockBot),
                subtask4 = new BotTask(mockBot),
                result;

            task.push(subtask1);
            task.push(subtask2);
            task.push(subtask3);
            task.push(subtask4);

            subtask1.completed = true;
            subtask2.completed = true;

            sinon.stub(subtask1, 'isSatisfied').returns(false);
            sinon.stub(subtask2, 'isSatisfied').returns(true);
            sinon.stub(subtask3, 'isSatisfied').returns(true);
            sinon.stub(subtask4, 'isSatisfied').returns(false);

            result = task.getResolvableTasks();

            result.indexOf(subtask1).should.be.equal(-1);
            result.indexOf(subtask2).should.be.equal(-1);
            result.indexOf(subtask3).should.be.equal(0);
            result.indexOf(subtask4).should.be.equal(-1);
        });
    });
});