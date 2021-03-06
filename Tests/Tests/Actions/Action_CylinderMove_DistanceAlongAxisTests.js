"use strict";
class Action_CylinderMove_DistanceAlongAxisTests extends TestFixture {
    constructor() {
        super(Action_CylinderMove_DistanceAlongAxisTests.name);
    }
    tests() {
        return [this.perform];
    }
    perform() {
        var constraint = Constraint_PositionOnCylinder.default();
        var constrainable = Constrainable.fromConstraint(constraint);
        var entity = new Entity("test", [constrainable]);
        var distanceToMove = 0;
        var action = new Action_CylinderMove_DistanceAlongAxis(distanceToMove);
        action.perform(entity);
    }
}
