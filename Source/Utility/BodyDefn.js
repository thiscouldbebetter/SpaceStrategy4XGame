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
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
