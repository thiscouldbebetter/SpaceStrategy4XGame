"use strict";
class Constraint_LookAt {
    constructor(targetPos) {
        this.name = "LookAt";
        this.targetPos = targetPos;
    }
    static default() {
        return new Constraint_LookAt(Coords.zeroes());
    }
    constrain(universe, world, place, body) {
        var bodyLoc = body.locatable().loc;
        var bodyPos = bodyLoc.pos;
        var bodyOrientation = bodyLoc.orientation;
        var bodyOrientationForwardNew = this.targetPos.clone().subtract(bodyPos).normalize();
        bodyOrientation.forwardSet(bodyOrientationForwardNew);
    }
}
