"use strict";

var BlockBase,

    HashMap = require('hashmap');

/**
 * Block Information Tracker
 *
 * @constructor
 */
BlockBase = function () {
    this.map = new HashMap();
};

/**
 * Compute a hash string for a position object
 *
 * @param position
 * @returns {string}
 */
BlockBase.prototype.computePositionHash = function (position) {
    return ['x', position.x, 'y', position.y, 'z', position.z].join('');
};

/**
 * Inform the knowledge base about the type of a block
 *
 * @param position
 * @param blockType
 */
BlockBase.prototype.tellBlock = function (position, blockType) {
    var hash = this.computePositionHash(position);

    this.map.set(hash, blockType);
};

/**
 * Ask if we have any knowledge about a current block
 *
 * @param position
 * @returns {*}
 */
BlockBase.prototype.askBlock = function (position) {
    var hash = this.computePositionHash(position);

    if (this.map.has(hash)) {
        return this.map.get(hash);
    }

    return null;
};

module.exports = BlockBase;