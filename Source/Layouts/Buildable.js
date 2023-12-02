"use strict";
class Buildable {
    constructor(defn, pos, isComplete, isAutomated) {
        this.defn = defn;
        var loc = Disposition.fromPos(pos);
        this._locatable = new Locatable(loc);
        this.isComplete = isComplete || false;
        this.isAutomated = isAutomated || false;
    }
    static fromDefn(defn) {
        return new Buildable(defn, null, // pos
        false, // isComplete
        false // isAutomated
        );
    }
    static fromDefnAndPosComplete(defn, pos) {
        return new Buildable(defn, pos, true, false);
    }
    static fromDefnAndPosIncomplete(defn, pos) {
        return new Buildable(defn, pos, false, false);
    }
    static ofEntity(entity) {
        return entity.propertyByName(Buildable.name);
    }
    effectPerRoundApply(uwpe) {
        this.defn.effectPerRoundApply(uwpe);
    }
    locatable() {
        return this._locatable;
    }
    toEntity(world) {
        if (this._entity == null) {
            this._entity = this.defn.buildableToEntity(this, world);
        }
        return this._entity;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
