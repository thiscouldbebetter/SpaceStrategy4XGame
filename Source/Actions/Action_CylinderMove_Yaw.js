"use strict";
class Action_CylinderMove_Yaw {
    constructor(turnsToMove) {
        this.turnsToMove = turnsToMove;
    }
    perform(actor) {
        var constraint = Constrainable.of(actor).constraintByClassName(Constraint_PositionOnCylinder.name);
        var constraintCylinder = constraint;
        constraintCylinder.yawInTurns += this.turnsToMove;
        NumberHelper.wrapToRangeMinMax(constraintCylinder.yawInTurns, 0, 1);
    }
}
