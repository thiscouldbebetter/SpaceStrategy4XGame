"use strict";
class Action_CylinderMove_RadiusTests extends TestFixture {
    constructor() {
        super(Action_CylinderMove_RadiusTests.name);
    }
    tests() {
        return [this.perform];
    }
    perform() {
        var constraint = Constraint_PositionOnCylinder.default();
        var constrainable = Constrainable.fromConstraint(constraint);
        var entity = new Entity("test", [constrainable]);
        var distanceToMove = 1;
        var action = new Action_CylinderMove_Radius(distanceToMove);
        action.perform(entity);
    }
}
