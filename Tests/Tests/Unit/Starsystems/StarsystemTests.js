"use strict";
class StarsystemTests extends TestFixture {
    constructor() {
        super(StarsystemTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        this.starsystem = this.world.factions()[0].starsystemHome(this.world);
        this.universe.soundHelper = new SoundHelperMock();
        var venue = new VenueStarsystem(null, this.starsystem);
        this.universe.venueNextSet(venue);
        venue.initialize(this.universe);
    }
    tests() {
        var returnTests = [
            this.generateRandom,
            this.faction,
            this.linkPortalAdd,
            this.linkPortalByStarsystemName,
            this.links,
            this.shipAdd,
            this.shipRemove,
            this.updateForTurn,
            this.draw
        ];
        return returnTests;
    }
    // Helpers.
    shipAddThenRemove() {
        var ship = this.shipBuild();
        Assert.isTrue(this.starsystem.ships.indexOf(ship) == -1);
        var uwpe = new UniverseWorldPlaceEntities(this.universe, this.world, null, null, null);
        this.starsystem.shipAdd(ship, uwpe);
        Assert.isTrue(this.starsystem.ships.indexOf(ship) >= 0);
        this.starsystem.shipRemove(ship);
        Assert.isTrue(this.starsystem.ships.indexOf(ship) == -1);
    }
    shipBuild() {
        var ship = new Ship("Ship", ShipHullSize.Instances().Small, Ship.bodyDefnBuild(Color.byName("Red")), new Coords(0, 0, 0), this.starsystem.faction(this.world), [] // devices
        );
        return ship;
    }
    // Tests.
    generateRandom() {
        var starsystem = Starsystem.generateRandom(this.universe, Starsystem.name + "Test");
        Assert.isNotNull(starsystem);
    }
    faction() {
        var faction = this.starsystem.faction(this.world);
        Assert.isNotNull(faction);
    }
    linkPortalAdd() {
        var starsystemOther = this.world.factions()[1].starsystemHome(this.world);
        var linkPortal = new LinkPortal(LinkPortal.name, LinkPortal.bodyDefn(), Coords.create(), 
        // starsystemNamesFromAndTo
        [
            this.starsystem.name,
            starsystemOther.name
        ]);
        Assert.isTrue(this.starsystem.linkPortals.indexOf(linkPortal) == -1);
        this.starsystem.linkPortalAdd(this.universe, linkPortal);
        Assert.isTrue(this.starsystem.linkPortals.indexOf(linkPortal) >= 0);
    }
    linkPortalByStarsystemName() {
        var linkPortal0 = this.starsystem.linkPortals[0];
        var starsystemDestinationName = linkPortal0.starsystemNameTo();
        var linkPortalRetrievedByName = this.starsystem.linkPortalByStarsystemName(starsystemDestinationName);
        Assert.isTrue(linkPortalRetrievedByName == linkPortal0);
    }
    links() {
        var network = this.world.starCluster;
        var links = this.starsystem.links(network);
        Assert.isNotNull(links);
    }
    shipAdd() {
        this.shipAddThenRemove();
    }
    shipRemove() {
        this.shipAddThenRemove();
    }
    // turns
    updateForTurn() {
        this.starsystem.updateForRound(this.universe, this.world);
    }
    draw() {
        this.starsystem.draw(this.universe, this.world, this.universe.display);
    }
}
