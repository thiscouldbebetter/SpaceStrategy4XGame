"use strict";
class BodyDefn {
    constructor(name, size, visual) {
        this.name = name;
        this.size = size;
        this.visual = visual;
        this.sizeHalf = this.size.clone().half();
    }
    static fromEntity(entity) {
        return entity.propertyByName(BodyDefn.name);
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
