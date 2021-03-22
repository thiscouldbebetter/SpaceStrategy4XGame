"use strict";
class Constraint_HoldDistanceFromTarget {
    constructor(distanceToHold, targetPos) {
        this.name = "HoldDistanceFromTarget";
        this.distanceToHold = distanceToHold;
        this.targetPos = targetPos;
        this.displacement = Coords.create();
    }
    constrain(universe, world, place, entity) {
        var body = entity;
        var bodyPos = body.locatable().loc.pos;
        var directionOfBodyFromTarget = this.displacement.overwriteWith(bodyPos).subtract(this.targetPos).normalize();
        bodyPos.overwriteWith(directionOfBodyFromTarget).multiplyScalar(this.distanceToHold).add(this.targetPos).round();
    }
}
