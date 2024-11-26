"use strict";
class VenueLayoutTests extends TestFixture {
    constructor() {
        super(VenueLayoutTests.name);
    }
    tests() {
        var returnValues = [
            this.finalize,
            this.initialize,
            this.model,
            this.updateForTimerTick,
            this.controlBuildableDetailsBuild,
            this.controlBuildableSelectBuild,
            this.toControl,
            this.draw
        ];
        return returnValues;
    }
    // Setup.
    universeBuild() {
        return new EnvironmentMock().universeBuild();
    }
    venueLayoutBuild(universe) {
        var world = universe.world;
        var faction = world.factions()[0];
        var planet = faction.planetHome(world);
        var layout = planet.layout(universe);
        var map = layout.map;
        var mapCursorPos = map.cursor.pos;
        var buildableDefn = BuildableDefn.fromName("buildableDefn");
        var isBuildableComplete = true;
        var isAutomatedFalse = false;
        var entity = new Entity("[entityName]", [
            new Buildable(buildableDefn, mapCursorPos, isBuildableComplete, isAutomatedFalse),
            Drawable.fromVisual(new VisualNone()),
            Locatable.fromPos(mapCursorPos)
        ]);
        map.entities().push(entity);
        var venueParent = null; // todo
        var modelParent = planet;
        var returnValue = new VenueLayout(venueParent, modelParent, layout);
        return returnValue;
    }
    // Tests.
    finalize() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        venueLayout.finalize(universe);
    }
    initialize() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        venueLayout.initialize(universe);
    }
    model() {
        var universe = this.universeBuild();
        var model = this.venueLayoutBuild(universe).model();
        Assert.isNotNull(model);
    }
    updateForTimerTick() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        venueLayout.initialize(universe);
        venueLayout.updateForTimerTick(universe);
    }
    // controls
    controlBuildableDetailsBuild() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        var control = venueLayout.controlBuildableDetailsBuild(universe);
        Assert.isNotNull(control);
    }
    controlBuildableSelectBuild() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        var cursorPos = Coords.zeroes();
        var control = venueLayout.controlBuildableSelectBuild(universe, cursorPos);
        Assert.isNotNull(control);
    }
    toControl() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        var control = venueLayout.toControl(universe);
        Assert.isNotNull(control);
    }
    // drawable
    draw() {
        var universe = this.universeBuild();
        var venueLayout = this.venueLayoutBuild(universe);
        venueLayout.draw(universe);
    }
}
