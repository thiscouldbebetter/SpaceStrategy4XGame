"use strict";
class Buildable {
    constructor(defnName, pos, isComplete, isAutomated) {
        this.defnName = defnName;
        var loc = Disposition.fromPos(pos);
        this._locatable = new Locatable(loc);
        this.isComplete = isComplete || false;
        this.isAutomated = isAutomated || false;
    }
    static fromDefnName(defnName) {
        return new Buildable(defnName, null, // pos
        false, // isComplete
        false // isAutomated
        );
    }
    static fromDefnNameAndPos(defnName, pos) {
        return new Buildable(defnName, pos, false, false);
    }
    static ofEntity(entity) {
        return entity.propertyByName(Buildable.name);
    }
    defn(world) {
        return world.buildableDefnByName(this.defnName);
    }
    locatable() {
        return this._locatable;
    }
    toEntity(world) {
        if (this._entity == null) {
            var defn = this.defn(world);
            this._entity = defn.buildableToEntity(this);
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
