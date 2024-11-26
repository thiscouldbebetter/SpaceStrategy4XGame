"use strict";
class BuildableTests extends TestFixture {
    constructor() {
        super(BuildableTests.name);
    }
    tests() {
        var returnValues = [
            this.ofEntity,
            this.defn,
            this.locatable,
            this.toEntity,
            this.finalize,
            this.initialize,
            this.updateForTimerTick
        ];
        return returnValues;
    }
    // Setup.
    buildableBuild(universe) {
        var world = universe.world;
        var buildableDefn = world.buildableDefns[0];
        return new Buildable(buildableDefn, Coords.zeroes(), // pos?
        false, // isComplete
        false // isAutomated
        );
    }
    universeBuild() {
        var returnValue = new EnvironmentMock().universeBuild();
        return returnValue;
    }
    // Tests.
    ofEntity() {
        var buildable = this.buildableBuild(this.universeBuild());
        var entity = new Entity("[name]", [buildable]);
        var buildableFromEntity = Buildable.ofEntity(entity);
        Assert.isNotNull(buildableFromEntity);
    }
    defn() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableDefn = buildable.defn;
        Assert.isNotNull(buildableDefn);
    }
    locatable() {
        var buildable = this.buildableBuild(this.universeBuild());
        var locatable = buildable.locatable();
        Assert.isNotNull(locatable);
    }
    toEntity() {
        var universe = this.universeBuild();
        var world = universe.world;
        var buildable = this.buildableBuild(universe);
        var entity = buildable.toEntity(world);
        Assert.isNotNull(entity);
    }
    // EntityProperty.
    finalize() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableAsEntity = new Entity("[name]", [buildable]);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, buildableAsEntity, null);
        buildable.finalize(uwpe);
    }
    initialize() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableAsEntity = new Entity("[name]", [buildable]);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, buildableAsEntity, null);
        buildable.initialize(uwpe);
    }
    updateForTimerTick() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableAsEntity = new Entity("[name]", [buildable]);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, buildableAsEntity, null);
        buildable.updateForTimerTick(uwpe);
    }
}
