"use strict";

var RuleEngine,

    FactCollection = require('./FactCollection');

/**
 * Knowledge Base for Minebot
 *
 * @constructor
 */
RuleEngine = function () {
    this.rules = [];

    this.facts = new FactCollection();
};

/**
 * Add a rule to the engine
 *
 * @param rule
 */
RuleEngine.prototype.registerRule = function (rule) {
    this.rules.push(rule);
};

/**
 * Execute all rules that are currently applicable
 */
RuleEngine.prototype.step = function () {
    var applicable = this.getApplicableRules();

    applicable.forEach(function (rule) {
        rule.execute(this.facts);
    }.bind(this));
};

/**
 * Return array of rules that are currently satisfiable
 *
 * @returns {Array.<BotRule>}
 */
RuleEngine.prototype.getSatisfiableRules = function () {
    return this.rules.filter(function (rule) {
        return this.isSatisfiable(rule);
    }.bind(this));
};

/**
 * Return array of rules that are currently applicable
 *
 * @returns {Array.<BotRule>}
 */
RuleEngine.prototype.getApplicableRules = function () {
    var satisfiable = this.getSatisfiableRules();

    return satisfiable.filter(function (rule) {
        return rule.isApplicable(rule);
    }.bind(this));
};

/**
 * Check if a rule is satisfiable
 *
 * @param rule
 * @returns {boolean}
 */
RuleEngine.prototype.isSatisfiable = function (rule) {
    var dependencies = rule.getDependencies(),
        satisfiable = true;

    dependencies.every(function (dependency) {
        if (this.facts.has(dependency) === false) {
            satisfiable = false;
            return false;
        }
    }.bind(this));

    return satisfiable;
};