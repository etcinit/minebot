"use strict";

var FactCollection,

    HashMap = require('hashmap');

/**
 * Collection of boolean variables (referenced as facts throughout the app)
 *
 * @constructor
 */
FactCollection = function () {
    this.map = new HashMap();
};

/**
 * Set a fact
 *
 * @param key
 * @param value
 */
FactCollection.prototype.set = function (key, value) {
    this.map.set(key, value);
};

/**
 * Set a fact as true
 *
 * @param key
 */
FactCollection.prototype.setTrue = function (key) {
    this.map.set(key, true);
};

/**
 * Set a fact as false
 *
 * @param key
 */
FactCollection.prototype.setFalse = function (key) {
    this.map.set(key, false);
};

/**
 * Return whether a fact exists or not
 *
 * @param key
 * @returns {*}
 */
FactCollection.prototype.has = function (key) {
    return this.map.has(key);
};

/**
 * Get the value of a fact (true or false)
 *
 * @param key
 * @returns {*}
 */
FactCollection.prototype.get = function (key) {
    return this.map.get(key);
};

module.exports = FactCollection;