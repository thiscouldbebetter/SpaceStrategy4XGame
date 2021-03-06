"use strict";
class Action_CylinderMove_ResetTests extends TestFixture {
    constructor() {
        super(Action_CylinderMove_ResetTests.name);
    }
    tests() {
        return [this.perform];
    }
    perform() {
        var camera = Camera.default();
        var constraint = Constraint_PositionOnCylinder.default();
        var constrainable = Constrainable.fromConstraint(constraint);
        var entity = new Entity("test", [camera, constrainable]);
        var action = new Action_CylinderMove_Reset();
        action.perform(entity);
    }
}
