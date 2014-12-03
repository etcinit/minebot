"use strict";

var BotRule;

/**
 * Single rule
 *
 * @constructor
 */
BotRule = function (app) {
    this.name = 'Default Rule';

    this.app = app;
};

/**
 * Returns an array of facts that have to exists before we can apply this rule
 *
 * @returns {Array}
 */
BotRule.prototype.getDependencies = function () {
    return [];
};

/**
 * Return whether or not this rule should be applied
 *
 * This should only be ran if all dependencies are met
 *
 * @param facts
 * @returns {boolean}
 */
BotRule.prototype.isApplicable = function (facts) {
    return false;
};

/**
 * Applies the rule to the knowledge base, possibly setting new facts
 *
 * This should only be called if all dependencies are met and the rule is applicable
 *
 * @param facts
 * @param taskQueue TaskQueue
 */
BotRule.prototype.execute = function (facts, taskQueue) {

};

module.exports = BotRule;