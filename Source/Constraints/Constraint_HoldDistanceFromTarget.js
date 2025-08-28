"use strict";
class Constraint_HoldDistanceFromTarget {
    constructor(distanceToHold, targetPos) {
        this.name = "HoldDistanceFromTarget";
        this.distanceToHold = distanceToHold;
        this.targetPos = targetPos;
        this.displacement = Coords.create();
    }
    static default() {
        return new Constraint_HoldDistanceFromTarget(1, Coords.zeroes());
    }
    constrain(uwpe) {
        var body = uwpe.entity;
        var bodyPos = Locatable.of(body).loc.pos;
        var directionOfBodyFromTarget = this.displacement.overwriteWith(bodyPos).subtract(this.targetPos).normalize();
        bodyPos.overwriteWith(directionOfBodyFromTarget).multiplyScalar(this.distanceToHold).add(this.targetPos).round();
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
