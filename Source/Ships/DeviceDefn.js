"use strict";
class DeviceDefn {
    constructor(name, isActive, needsTarget, categories, initialize, updateForRound, usesPerRound, energyPerUse, use) {
        this.name = name;
        this.isActive = isActive;
        this.needsTarget = needsTarget;
        this.categories = categories;
        this._initialize = initialize;
        this.updateForRound = updateForRound;
        this.usesPerRound = usesPerRound || 1;
        this.energyPerUse = energyPerUse || 0;
        this._use = use;
    }
    initialize(uwpe) {
        this._initialize(uwpe);
    }
    use(uwpe) {
        var entityUsing = uwpe.entity;
        var deviceUser = DeviceUser.ofEntity(entityUsing);
        var energyNeededIsAvailable = deviceUser.energyRemainsThisRound(this.energyPerUse);
        if (energyNeededIsAvailable) {
            deviceUser.energyRemainingThisRoundSubtract(this.energyPerUse);
            this._use(uwpe);
        }
    }
}
