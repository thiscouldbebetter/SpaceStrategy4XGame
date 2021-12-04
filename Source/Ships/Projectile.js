"use strict";
class Projectile {
    constructor(shipParent) {
        this.shipParent = shipParent;
    }
    static bodyDefnBuild() {
        var scaleFactor = 10;
        var bodyDefn = new BodyDefn("Projectile", Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
        new VisualCircle(3, Color.byName("Yellow"), null, null));
        return bodyDefn;
    }
}
