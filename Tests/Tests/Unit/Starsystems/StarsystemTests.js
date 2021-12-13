"use strict";
class StarsystemTests extends TestFixture {
    constructor() {
        super(StarsystemTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        this.starsystem = this.world.factions[0].starsystemHome(this.world);
        this.universe.soundHelper = new SoundHelperMock();
        this.universe.venueCurrent = new VenueStarsystem(null, this.starsystem);
        this.universe.venueCurrent.initialize(this.universe);
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
        this.starsystem.shipAdd(ship);
        Assert.isTrue(this.starsystem.ships.indexOf(ship) >= 0);
        this.starsystem.shipRemove(ship);
        Assert.isTrue(this.starsystem.ships.indexOf(ship) == -1);
    }
    shipBuild() {
        var ship = new Ship("Ship", Ship.bodyDefnBuild(Color.byName("Red")), new Coords(0, 0, 0), this.starsystem.factionName, [] // devices
        );
        return ship;
    }
    // Tests.
    generateRandom() {
        var starsystem = Starsystem.generateRandom(this.universe);
        Assert.isNotNull(starsystem);
    }
    faction() {
        var faction = this.starsystem.faction(this.world);
        Assert.isNotNull(faction);
    }
    linkPortalAdd() {
        var starsystemOther = this.world.factions[1].starsystemHome(this.world);
        var linkPortal = new LinkPortal(LinkPortal.name, LinkPortal.bodyDefn(), Coords.create(), 
        // starsystemNamesFromAndTo
        [
            this.starsystem.name,
            starsystemOther.name
        ]);
        Assert.isTrue(this.starsystem.linkPortals.indexOf(linkPortal) == -1);
        this.starsystem.linkPortalAdd(linkPortal);
        Assert.isTrue(this.starsystem.linkPortals.indexOf(linkPortal) >= 0);
    }
    linkPortalByStarsystemName() {
        var linkPortal0 = this.starsystem.linkPortals[0];
        var starsystemDestinationName = linkPortal0.starsystemNameTo();
        var linkPortalRetrievedByName = this.starsystem.linkPortalByStarsystemName(starsystemDestinationName);
        Assert.isTrue(linkPortalRetrievedByName == linkPortal0);
    }
    links() {
        var network = this.world.network;
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
        this.starsystem.updateForTurn(this.universe, this.world);
    }
    draw() {
        this.starsystem.draw(this.universe, this.world, this.universe.display);
    }
}
