"use strict";
class StarsystemTraverser {
    constructor(distanceMaxPerMove) {
        this._distanceMaxPerMove = distanceMaxPerMove;
    }
    static ofEntity(entity) {
        return entity.propertyByName(StarsystemTraverser.name);
    }
    distanceMaxPerMove() {
        return this._distanceMaxPerMove;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Clonable.
    clone() {
        throw new Error("Not yet implemented.");
    }
    overwriteWith(other) {
        throw new Error("Not yet implemented.");
    }
    // Equatable.
    equals(other) {
        return false; // todo
    }
}
