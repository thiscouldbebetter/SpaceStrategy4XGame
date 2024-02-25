"use strict";
class SystemTests extends TestFixture {
    constructor() {
        super(SystemTests.name);
    }
    tests() {
        var returnTests = [
            this.playFromStart
        ];
        return returnTests;
    }
    // Tests.
    playFromStart() {
        var universe = new EnvironmentMock().universeBuild();
        var world = universe.world;
        var factionUser = world.factions()[0];
        var starsystemUser = factionUser.starsystemHome(world);
        var planetUser = factionUser.planetHome(world);
        var positionsAvailableToBuildAt = planetUser.cellPositionsAvailableToBuildOnSurface(universe);
        var posToBuildAt = positionsAvailableToBuildAt[0];
        var buildableDefns = BuildableDefnsLegacy.Instance(Coords.ones());
        var buildableLaboratory = Buildable.fromDefnAndPosIncomplete(buildableDefns.SurfaceLaboratory, posToBuildAt);
        var buildableLabAsEntity = buildableLaboratory.toEntity(world);
        planetUser.buildableEntityBuild(universe, buildableLabAsEntity);
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, null, null);
        while (buildableLaboratory.isComplete == false) {
            world.updateForRound_IgnoringNotifications(uwpe);
        }
        Assert.isTrue(buildableLaboratory.isComplete);
        var researcher = factionUser.technologyResearcher;
        var technologiesNeededToBuildShipNames = [
            "Orbital Structures",
            "Interplanetary Exploration",
            "Tonklin Diary",
            "Xenobiology",
            "Environmental Encapsulation",
            "Spectral Analysis",
            "Superconductivity",
            "Spacetime Surfing"
        ];
        for (var t = 0; t < technologiesNeededToBuildShipNames.length; t++) {
            var technologyToResearchName = technologiesNeededToBuildShipNames[t];
            var technologiesAvailableToResearch = researcher.technologiesAvailableForResearch(world);
            var technologyToResearch = technologiesAvailableToResearch.find(x => x.name == technologyToResearchName);
            researcher.technologyResearch(technologyToResearch);
            var hasTechnologyBeenDiscoveredYet = false;
            while (hasTechnologyBeenDiscoveredYet == false) {
                world.updateForRound_IgnoringNotifications(uwpe);
                hasTechnologyBeenDiscoveredYet =
                    researcher.technologyIsKnown(technologyToResearch);
            }
        }
        positionsAvailableToBuildAt =
            planetUser.cellPositionsAvailableToOccupyInOrbit(universe);
        posToBuildAt = positionsAvailableToBuildAt[0];
        var buildableShipyard = Buildable.fromDefnAndPosIncomplete(buildableDefns.OrbitalShipyard, posToBuildAt);
        var shipyardEntity = buildableShipyard.toEntity(world);
        planetUser.buildableEntityBuild(universe, shipyardEntity);
        while (buildableShipyard.isComplete == false) {
            world.updateForRound_IgnoringNotifications(uwpe);
        }
        positionsAvailableToBuildAt =
            planetUser.cellPositionsAvailableToOccupyInOrbit(universe);
        posToBuildAt = positionsAvailableToBuildAt[0];
        var shipComponentsAsBuildableDefns = [
            buildableDefns.ShipDrive1TonklinMotor,
            buildableDefns.ShipGenerator1ProtonShaver,
            buildableDefns.ShipItemColonizer,
            buildableDefns.ShipItemColonizer
        ];
        for (var i = 0; i < shipComponentsAsBuildableDefns.length; i++) {
            var shipComponentAsBuildableDefn = shipComponentsAsBuildableDefns[i];
            var buildableShipComponent = Buildable.fromDefn(shipComponentAsBuildableDefn);
            var buildableShipComponentAsEntity = buildableShipComponent.toEntity(world);
            planetUser.buildableEntityBuild(universe, buildableShipComponentAsEntity);
            Assert.isFalse(buildableShipComponent.isComplete);
            while (buildableShipComponent.isComplete == false) {
                world.updateForRound_IgnoringNotifications(uwpe);
            }
            Assert.isTrue(buildableShipComponent.isComplete);
        }
        var shipyard = new ShipBuilder();
        var ship = shipyard.build(
        /*
        universe,
        world,
        factionUser,
        planetUser,
        shipyardEntity,
        shipComponentNames
        */
        universe, null, // todo - venuePrev,
        factionUser, universe.display.sizeInPixels // sizeDialog
        );
        Assert.isNotNull(ship);
        ship.planetOrbitExit(planetUser, uwpe);
        var linkPortalToGoTo = starsystemUser.linkPortals[0];
        Assert.isNotNull(linkPortalToGoTo);
        var starsystemBeyondLinkName = linkPortalToGoTo.name.split(" to ")[1];
        var network = world.starCluster;
        var starsystemBeyondLink = network.starsystemByName(starsystemBeyondLinkName);
        var factionUserKnowledge = factionUser.knowledge;
        var starsystemsKnown = factionUserKnowledge.starsystems(world);
        Assert.isTrue(starsystemsKnown.length == 1);
        var orderDefns = OrderDefn.Instances();
        var shipOrder = new Order().defnSet(orderDefns.Go).entityBeingTargetedSet(linkPortalToGoTo);
        ship.orderSet(shipOrder);
        universe.venueNextSet(starsystemUser.toVenue()); // Can this be avoided?
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, ship, null);
        while (shipOrder.isComplete == false) {
            var shipTurnAndMove = ship.deviceUser();
            var shipEnergyBeforeMove = shipTurnAndMove.energyRemainingThisRound(uwpe);
            if (shipEnergyBeforeMove < shipTurnAndMove.energyPerMove()) {
                world.updateForRound_IgnoringNotifications(uwpe);
            }
            else {
                while (shipOrder.isComplete == false
                    && shipTurnAndMove.energyRemainingThisRound(uwpe) == shipEnergyBeforeMove) {
                    shipOrder.obey(uwpe);
                    universe.updateForTimerTick();
                }
            }
        }
        // There's something weird going on with these two lines.
        shipOrder.clear();
        shipOrder.isComplete = false; // hack - This shouldn't be necessary, but is.
        universe.venueCurrent = null;
        var shipLoc = ship.locatable().loc;
        while (shipLoc.placeName.startsWith(StarClusterLink.name)) {
            world.updateForRound_IgnoringNotifications(uwpe);
        }
        Assert.isTrue(shipLoc.placeName.startsWith(Starsystem.name));
        Assert.isTrue(shipLoc.placeName.endsWith(starsystemBeyondLink.name));
        Assert.isTrue(starsystemsKnown.length == 2);
        Assert.isTrue(starsystemsKnown.indexOf(starsystemBeyondLink) >= 0);
        var starsystemArrivedAt = world.starCluster.starsystemByName(starsystemBeyondLinkName);
        universe.venueNextSet(starsystemArrivedAt.toVenue()); // Can this be avoided?
        var planetsInStarsystemArrivedAt = starsystemArrivedAt.planets;
        var planetToColonize = planetsInStarsystemArrivedAt.find(x => x.factionable().faction() == null);
        if (planetToColonize != null) {
            shipOrder.defnSet(orderDefns.Go).entityBeingTargetedSet(planetToColonize);
            while (shipOrder.isComplete == false) {
                var shipDeviceUser = ship.deviceUser();
                var shipEnergyBeforeMove = shipDeviceUser.energyRemainingThisRound(uwpe);
                if (shipEnergyBeforeMove < shipDeviceUser.energyPerMove()) {
                    world.updateForRound_IgnoringNotifications(uwpe);
                }
                else {
                    while (shipOrder.isComplete == false
                        && shipDeviceUser.energyRemainingThisRound(uwpe) == shipEnergyBeforeMove) {
                        shipOrder.obey(uwpe);
                        universe.updateForTimerTick();
                    }
                }
            }
            Assert.isTrue(shipLoc.placeName.startsWith(Planet.name));
            Assert.isTrue(shipLoc.placeName.endsWith(planetToColonize.name));
            Assert.isNull(planetToColonize.factionable().faction());
            var wasColonizationSuccessful = ship.planetColonize(universe, world);
            Assert.isTrue(wasColonizationSuccessful);
            var shipFaction = ship.factionable().faction();
            var planetToColonizeFaction = planetToColonize.factionable().faction();
            var starsystemArrivedAtFaction = starsystemArrivedAt.faction(world);
            Assert.areEqual(shipFaction, planetToColonizeFaction);
            Assert.areEqual(shipFaction, starsystemArrivedAtFaction);
            Assert.isTrue(factionUser.planets.indexOf(planetToColonize) >= 0);
        }
    }
}
