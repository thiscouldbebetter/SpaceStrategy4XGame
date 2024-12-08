"use strict";
class Order //
 {
    constructor() {
        this.clear();
    }
    static fromDefn(defn) {
        return new Order().defnSet(defn);
    }
    clear() {
        this.defn = OrderDefn.Instances().DoNothing;
        this.entityBeingOrdered = null;
        this.deviceToUse = null;
        this.entityBeingTargeted = null;
        this.isCompleteSet(false);
        return this;
    }
    complete() {
        this.isCompleteSet(true);
        return this;
    }
    defnSet(value) {
        this.defn = value;
        return this;
    }
    deviceToUseSet(value) {
        this.deviceToUse = value;
        return this;
    }
    entityBeingOrderedSet(value) {
        this.entityBeingOrdered = value;
        return this;
    }
    entityBeingTargetedSet(value) {
        this.entityBeingTargeted = value;
        return this;
    }
    isAwaitingTarget() {
        return (this.entityBeingTargeted == null);
    }
    isComplete() {
        return this._isComplete;
    }
    isCompleteSet(value) {
        this._isComplete = value;
        return this;
    }
    isNothing() {
        return (this.defn == OrderDefn.Instances().DoNothing);
    }
    obey(uwpe) {
        var entityBeingOrdered = this.entityBeingOrdered;
        uwpe.entitySet(entityBeingOrdered);
        this.defn.obey(uwpe);
    }
    toStringDescription() {
        return this.defn.description + " " + this.entityBeingTargeted.name;
    }
}
class Orderable {
    static fromEntity(entity) {
        return entity.propertyByName(Orderable.name);
    }
    order(entityOrderable) {
        if (this._order == null) {
            this._order = new Order().entityBeingOrderedSet(entityOrderable);
        }
        return this._order;
    }
    orderSet(value) {
        this._order = value;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    propertyName() { return Orderable.name; }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
