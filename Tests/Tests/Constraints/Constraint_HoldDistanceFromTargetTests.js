"use strict";
class Constraint_HoldDistanceFromTargetTests extends TestFixture {
    constructor() {
        super(Constraint_HoldDistanceFromTargetTests.name);
    }
    tests() {
        return [this.constrain];
    }
    constrain() {
        var universe = new EnvironmentMock().universeBuild();
        var world = universe.world;
        var place = null;
        var constraint = Constraint_HoldDistanceFromTarget.default();
        var constrainable = Constrainable.fromConstraint(constraint);
        var locatable = Locatable.fromPos(Coords.random(universe.randomizer));
        var entity = new Entity("test", [constrainable, locatable]);
        constraint.constrain(universe, world, place, entity);
    }
}
