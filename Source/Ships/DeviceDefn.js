"use strict";
class DeviceDefn extends ItemDefn {
    constructor(name, isActive, needsTarget, categoryNames, initialize, updateForTurn, use) {
        super(name, name, // appearance
        name, // description
        null, // mass
        null, // tradeValue
        null, // stackSizeMax
        categoryNames, use, null, // visual
        null);
        this.isActive = isActive;
        this.needsTarget = needsTarget;
        this._initialize = initialize;
        this.updateForTurn = updateForTurn;
        this.use = use;
    }
    initialize(uwpe) {
        this._initialize(uwpe);
    }
    toItem() {
        return new Device(this);
    }
}
