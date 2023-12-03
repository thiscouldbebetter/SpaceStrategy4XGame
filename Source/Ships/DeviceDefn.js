"use strict";
class DeviceDefn {
    constructor(name, isActive, needsTarget, categoryNames, initialize, updateForRound, use) {
        this.name = name;
        this.isActive = isActive;
        this.needsTarget = needsTarget;
        this._initialize = initialize;
        this.updateForRound = updateForRound;
        this._use = use;
    }
    initialize(uwpe) {
        this._initialize(uwpe);
    }
    use(uwpe) {
        this._use(uwpe);
    }
}
