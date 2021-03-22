"use strict";
class EntityExtensions {
    static body(entity) {
        return entity.propertyByName(Body.name);
    }
    static buildable(entity) {
        return entity.propertyByName(Buildable.name);
    }
    static cursor(entity) {
        return entity.propertyByName(Cursor.name);
    }
    static linkPortal(entity) {
        return entity.propertyByName(LinkPortal.name);
    }
    static networkNode(entity) {
        return entity.propertyByName(NetworkNode2.name);
    }
    static planet(entity) {
        return entity.propertyByName(Planet.name);
    }
    static ship(entity) {
        return entity.propertyByName(Ship.name);
    }
}
