"use strict";
class ShipTests extends TestFixture {
    constructor() {
        super(ShipTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var faction = this.world.factions[0];
        this.ship = faction.ships[0];
    }
    tests() {
        var returnTests = [
            this.bodyDefnBuild,
            this.faction,
            this.nameWithFaction,
            this.devicesUsable,
            this.linkPortalEnter,
            this.linkExit,
            this.moveTowardTarget,
            this.movementThroughLinkPerTurn,
            this.planetOrbitEnter,
            this.toControl,
            this.updateForTurn,
            this.draw,
            this.visual
        ];
        return returnTests;
    }
    // Helpers.
    linkPortalEnterThenExit() {
        var network = this.world.network;
        var starsystemFrom = this.ship.starsystem(this.world);
        var linkPortal = starsystemFrom.linkPortals[0];
        this.ship.linkPortalEnter(network, linkPortal, this.ship);
        var link = linkPortal.link(network);
        this.ship.linkExit(this.world, link);
    }
    // Tests.
    bodyDefnBuild() {
        var bodyDefn = Ship.bodyDefnBuild(Color.byName("Red"));
        Assert.isNotNull(bodyDefn);
    }
    faction() {
        var faction = this.ship.faction(this.world);
        Assert.isNotNull(faction);
    }
    nameWithFaction() {
        var nameWithFaction = this.ship.nameWithFaction();
        Assert.isNotNull(nameWithFaction);
    }
    // devices
    devicesUsable() {
        var devicesUsable = this.ship.devicesUsable(this.world);
        Assert.isNotNull(devicesUsable);
    }
    // movement
    linkPortalEnter() {
        this.linkPortalEnterThenExit();
    }
    linkExit() {
        this.linkPortalEnterThenExit();
    }
    moveTowardTarget() {
        var starsystem = this.ship.starsystem(this.world);
        var targetEntity = starsystem.star;
        this.ship.moveTowardTarget(this.universe, targetEntity, this.ship);
    }
    movementThroughLinkPerTurn() {
        var link = null;
        var speed = this.ship.movementThroughLinkPerTurn(link);
        Assert.isNotNull(speed);
    }
    planetOrbitEnter() {
        var starsystem = this.ship.starsystem(this.world);
        var planet = starsystem.planets[0];
        this.ship.planetOrbitEnter(this.universe, starsystem, planet, this.ship);
    }
    // controls
    toControl() {
        var control = this.ship.toControl(this.universe, this.universe.display.sizeInPixels);
        Assert.isNotNull(control);
    }
    // diplomacy
    strength() {
        var strength = this.ship.strength(this.world);
        Assert.isNotNull(strength);
    }
    // turns
    updateForTurn() {
        var faction = this.ship.faction(this.world);
        this.ship.updateForTurn(this.universe, this.world, faction);
    }
    // drawable
    draw() {
        var camera = Camera.default();
        this.ship.draw(this.universe, 10, // nodeRadiusActual,
        camera, new Coords(0, 0, 0) // drawPos
        );
    }
    visual() {
        var visual = this.ship.visual(this.world);
        Assert.isNotNull(visual);
    }
}
