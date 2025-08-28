"use strict";
class Action_CylinderMove_DistanceAlongAxis {
    constructor(distanceToMove) {
        this.distanceToMove = distanceToMove;
    }
    perform(actor) {
        var constraint = Constrainable.of(actor).constraintByClassName(Constraint_PositionOnCylinder.name);
        var constraintCylinder = constraint;
        constraintCylinder.distanceFromCenterAlongAxis += this.distanceToMove;
    }
}
