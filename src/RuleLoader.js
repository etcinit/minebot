"use strict";

var RuleLoader,

    requireDir = require('require-dir');

/**
 * Class RuleLoader
 *
 * @param app
 * @constructor
 */
RuleLoader = function (app) {
    this.rules = {};

    this.app = app;
};

/**
 * Load rules from rule directory
 *
 * @returns {Array}
 */
RuleLoader.prototype.load = function () {
    var initializedRules = [],
        key;

    this.rules = requireDir('./Rules');

    console.log('Loaded', Object.keys(this.rules).length, 'rules');

    for (key in this.rules) {
        initializedRules[key] = new this.rules[key](this.app);

        console.log('Instantiating rule:', key, 'with name: "', initializedRules[key].name, '"');
    }

    console.log('Constructed rule instances');

    return initializedRules;
};

module.exports = RuleLoader;
