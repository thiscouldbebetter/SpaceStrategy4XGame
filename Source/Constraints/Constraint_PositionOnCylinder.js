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
    constrain(universe, world, place, constrainable) {
        var body = constrainable;
        NumberHelper.wrapToRangeMinMax(this.yawInTurns, 0, 1);
        var yawInRadians = this.yawInTurns * Polar.RadiansPerTurn;
        var bodyLoc = body.locatable().loc;
        var bodyPos = bodyLoc.pos;
        var bodyOrientation = bodyLoc.orientation;
        bodyPos.overwriteWith(this.orientation.down).multiplyScalar(this.distanceFromCenterAlongAxis).add(this.center).add(this.orientation.forward.clone().multiplyScalar(Math.cos(yawInRadians)).add(this.orientation.right.clone().multiplyScalar(Math.sin(yawInRadians))).multiplyScalar(this.radius));
        bodyOrientation.overwriteWith(this.orientation);
    }
}
