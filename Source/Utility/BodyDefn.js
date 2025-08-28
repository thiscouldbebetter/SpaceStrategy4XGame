"use strict";
class BodyDefn extends EntityPropertyBase {
    constructor(name, size, visual) {
        super();
        this.name = name;
        this.size = size;
        this.visual = visual;
        this.sizeHalf = this.size.clone().half();
    }
    static fromEntity(entity) {
        return entity.propertyByName(BodyDefn.name);
    }
}
