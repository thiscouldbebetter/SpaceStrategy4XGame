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
        var factionUser = world.factions[0];
        var starsystemUser = factionUser.starsystemHome(world);
        var planetUser = factionUser.planetHome(world);
        var positionsAvailableToBuildAt = planetUser.cellPositionsAvailableToBuildOnSurface();
        var posToBuildAt = positionsAvailableToBuildAt[0];
        var buildableLaboratory = Buildable.fromDefnNameAndPos("Laboratory", posToBuildAt);
        var buildableLabAsEntity = buildableLaboratory.toEntity(world);
        planetUser.buildableEntityBuild(buildableLabAsEntity);
        while (buildableLaboratory.isComplete == false) {
            world.updateForTurn_IgnoringNotifications(universe);
        }
        Assert.isTrue(buildableLaboratory.isComplete);
        var researcher = factionUser.technologyResearcher;
        var technologiesNeededToBuildShipNames = [
            "Drives, Basic",
            "Generators, Basic",
            "Biology, Basic",
            "Shields, Basic",
            "Space Structures, Basic",
            "Weapons, Basic"
        ];
        for (var t = 0; t < technologiesNeededToBuildShipNames.length; t++) {
            var technologyToResearchName = technologiesNeededToBuildShipNames[t];
            var technologiesAvailableToResearch = researcher.technologiesAvailableForResearch(world);
            var technologyToResearch = technologiesAvailableToResearch.find(x => x.name == technologyToResearchName);
            researcher.technologyResearch(technologyToResearch);
            var hasTechnologyBeenDiscoveredYet = false;
            while (hasTechnologyBeenDiscoveredYet == false) {
                world.updateForTurn_IgnoringNotifications(universe);
                hasTechnologyBeenDiscoveredYet =
                    researcher.technologyIsKnown(technologyToResearch);
            }
        }
        positionsAvailableToBuildAt =
            planetUser.cellPositionsAvailableToOccupyInOrbit();
        posToBuildAt = positionsAvailableToBuildAt[0];
        var buildableShipyard = Buildable.fromDefnNameAndPos("Shipyard", posToBuildAt);
        var shipyardEntity = buildableShipyard.toEntity(world);
        planetUser.buildableEntityBuild(shipyardEntity);
        while (buildableShipyard.isComplete == false) {
            world.updateForTurn_IgnoringNotifications(universe);
        }
        positionsAvailableToBuildAt =
            planetUser.cellPositionsAvailableToOccupyInOrbit();
        posToBuildAt = positionsAvailableToBuildAt[0];
        var shipComponentNames = [
            "Ship Hull, Small",
            "Ship Drive, Basic",
            "Ship Generator, Basic",
            "Colony Hub",
            "Colony Hub"
        ];
        for (var i = 0; i < shipComponentNames.length; i++) {
            var shipComponentName = shipComponentNames[i];
            var buildableShipComponent = Buildable.fromDefnName(shipComponentName);
            var buildableShipComponentAsEntity = buildableShipComponent.toEntity(world);
            planetUser.buildableEntityBuild(buildableShipComponentAsEntity);
            Assert.isFalse(buildableShipComponent.isComplete);
            while (buildableShipComponent.isComplete == false) {
                world.updateForTurn_IgnoringNotifications(universe);
            }
            Assert.isTrue(buildableShipComponent.isComplete);
        }
        var shipyard = Shipyard.fromEntity(shipyardEntity);
        var ship = shipyard.shipAssembleFromComponentsAndLaunch(universe, world, factionUser, planetUser, shipyardEntity, shipComponentNames);
        Assert.isNotNull(ship);
        ship.planetOrbitExit(universe, starsystemUser, planetUser);
        var linkPortalToGoTo = starsystemUser.linkPortals[0];
        Assert.isNotNull(linkPortalToGoTo);
        var starsystemBeyondLinkName = linkPortalToGoTo.name.split(" to ")[1];
        var factionUserKnowledge = factionUser.knowledge;
        var starsystemsKnownNames = factionUserKnowledge.starsystemNames;
        Assert.isTrue(starsystemsKnownNames.length == 1);
        var orderDefns = OrderDefn.Instances();
        var shipOrder = new Order(orderDefns.Go.name, linkPortalToGoTo);
        ship.orderSet(shipOrder);
        universe.venueNext = starsystemUser.toVenue(); // Can this be avoided?
        while (shipOrder.isComplete == false) {
            var shipTurnAndMove = ship.turnAndMove;
            var shipEnergyBeforeMove = shipTurnAndMove.energyThisTurn;
            if (shipEnergyBeforeMove < shipTurnAndMove.energyPerMove) {
                world.updateForTurn_IgnoringNotifications(universe);
            }
            else {
                while (shipOrder.isComplete == false
                    && shipTurnAndMove.energyThisTurn == shipEnergyBeforeMove) {
                    shipOrder.obey(universe, world, null, ship);
                    universe.updateForTimerTick();
                }
            }
        }
        // There's something weird going on with these two lines.
        shipOrder.clear();
        shipOrder.isComplete = false; // hack - This shouldn't be necessary, but is.
        universe.venueCurrent = null;
        var shipLoc = ship.locatable().loc;
        while (shipLoc.placeName.startsWith(NetworkLink2.name)) {
            world.updateForTurn_IgnoringNotifications(universe);
        }
        Assert.isTrue(shipLoc.placeName.startsWith(Starsystem.name));
        Assert.isTrue(shipLoc.placeName.endsWith(starsystemBeyondLinkName));
        Assert.isTrue(starsystemsKnownNames.length == 2);
        Assert.isTrue(starsystemsKnownNames.indexOf(starsystemBeyondLinkName) >= 0);
        var starsystemArrivedAt = world.network.starsystemByName(starsystemBeyondLinkName);
        universe.venueNext = starsystemArrivedAt.toVenue(); // Can this be avoided?
        var planetsInStarsystemArrivedAt = starsystemArrivedAt.planets;
        var planetToColonize = planetsInStarsystemArrivedAt.find(x => x.factionName == null);
        if (planetToColonize != null) {
            shipOrder.defnNameAndTargetEntitySet(orderDefns.Go.name, planetToColonize).assignToEntityOrderable(ship);
            while (shipOrder.isComplete == false) {
                var shipTurnAndMove = ship.turnAndMove;
                var shipEnergyBeforeMove = shipTurnAndMove.energyThisTurn;
                if (shipEnergyBeforeMove < shipTurnAndMove.energyPerMove) {
                    world.updateForTurn_IgnoringNotifications(universe);
                }
                else {
                    while (shipOrder.isComplete == false
                        && shipTurnAndMove.energyThisTurn == shipEnergyBeforeMove) {
                        shipOrder.obey(universe, world, null, ship);
                        universe.updateForTimerTick();
                    }
                }
            }
            Assert.isTrue(shipLoc.placeName.startsWith(Planet.name));
            Assert.isTrue(shipLoc.placeName.endsWith(planetToColonize.name));
            Assert.isNull(planetToColonize.factionName);
            var wasColonizationSuccessful = ship.planetColonize(universe, world);
            Assert.isTrue(wasColonizationSuccessful);
            Assert.areStringsEqual(ship.factionName, planetToColonize.factionName);
            Assert.areStringsEqual(ship.factionName, starsystemArrivedAt.factionName);
            Assert.isTrue(factionUser.planets.indexOf(planetToColonize) >= 0);
        }
    }
}
