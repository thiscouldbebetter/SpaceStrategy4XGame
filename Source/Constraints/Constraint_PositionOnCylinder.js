"use strict";
class Constraint_PositionOnCylinder {
    constructor(center, orientation, yawInTurns, radius, distanceFromCenterAlongAxis) {
        this.name = "PositionOnCylinder";
        this.center = center;
        this.orientation = orientation;
        this.yawInTurns = yawInTurns;
        this.radius = radius;
        this.distanceFromCenterAlongAxis = distanceFromCenterAlongAxis;
    }
    static default() {
        return new Constraint_PositionOnCylinder(Coords.zeroes(), // center
        Orientation.default(), // orientation
        0, // yawInTurns
        1, // radius
        1 // distanceFromCenterAlongAxis
        );
    }
    constrain(uwpe) {
        var body = uwpe.entity;
        NumberHelper.wrapToRangeMinMax(this.yawInTurns, 0, 1);
        var yawInRadians = this.yawInTurns * Polar.RadiansPerTurn;
        var bodyLoc = Locatable.of(body).loc;
        var bodyPos = bodyLoc.pos;
        var bodyOrientation = bodyLoc.orientation;
        bodyPos.overwriteWith(this.orientation.down).multiplyScalar(this.distanceFromCenterAlongAxis).add(this.center).add(this.orientation.forward.clone().multiplyScalar(Math.cos(yawInRadians)).add(this.orientation.right.clone().multiplyScalar(Math.sin(yawInRadians))).multiplyScalar(this.radius));
        bodyOrientation.overwriteWith(this.orientation);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
