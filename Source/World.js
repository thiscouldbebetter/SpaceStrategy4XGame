"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, deviceDefns, technologyGraph, network, factions, ships, camera) {
        super(name, dateCreated, new WorldDefn([
            activityDefns
        ]), // worldDefn
        (placeName) => {
            return this.places.find(x => x.name == placeName);
        }, // placeGetByName
        (network == null ? "dummy" : network.name));
        this.buildableDefns = buildableDefns;
        this.deviceDefns = deviceDefns;
        this.technologyGraph = technologyGraph;
        this.network = network;
        this.factions = factions;
        this.ships = ships;
        this.camera = camera;
        this.dateSaved = this.dateCreated;
        this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);
        this.deviceDefnsByName = ArrayHelper.addLookupsByName(this.deviceDefns);
        this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
        //this.shipsByName = ArrayHelper.addLookupsByName(this.ships);
        this.defn.itemDefnsInitialize([]);
        this.defn.itemDefns.push(...deviceDefns);
        var buildableDefnsNonDevice = this.buildableDefns.filter(x => this.deviceDefnsByName.has(x.name) == false);
        var itemDefns = buildableDefnsNonDevice.map(x => ItemDefn.fromName(x.name));
        this.defn.itemDefns.push(...itemDefns);
        this.defn.itemDefnsByName = ArrayHelper.addLookupsByName(this.defn.itemDefns);
        this.roundsSoFar = 0;
        this._isAdvancingThroughRoundsUntilNotification = false;
        this.factionIndexCurrent = 0;
        this.places = [];
        this.places.push(this.network);
        this.places.push(...this.network.nodes.map(x => x.starsystem));
    }
    // static methods
    static create(universe, worldCreator) {
        var settings = worldCreator.settings;
        var starsystemCount = parseInt(settings.starsystemCount);
        var factionCount = parseInt(settings.factionCount);
        var factionDefnNameForPlayer = settings.factionDefnName;
        var worldName = NameGenerator.generateName() + " Cluster";
        var activityDefns = ArrayHelper.flattenArrayOfArrays([
            new ActivityDefn_Instances2()._All,
            ActivityDefn.Instances()._All
        ]);
        var viewSize = universe.display.sizeInPixels.clone();
        var mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0); // hack
        var buildableDefns = 
        // new BuildableDefnsBasic(mapCellSizeInPixels)._All;
        new BuildableDefnsLegacy(mapCellSizeInPixels);
        var technologyGraph = 
        // TechnologyGraph.demo(mapCellSizeInPixels);
        TechnologyGraph.legacy(mapCellSizeInPixels, buildableDefns);
        var viewDimension = viewSize.y;
        var networkRadius = viewDimension * .25;
        var network = Network2.generateRandom(universe, worldName, NetworkNodeDefn.Instances()._All, starsystemCount).scale(networkRadius);
        var focalLength = viewDimension;
        viewSize.z = focalLength;
        var deviceDefns = WorldExtended.create_DeviceDefns();
        var deviceDefnsByName = ArrayHelper.addLookupsByName(deviceDefns);
        var factionsAndShips = WorldExtended.create_FactionsAndShips(universe, network, technologyGraph, buildableDefns, deviceDefnsByName, factionCount, factionDefnNameForPlayer);
        var factions = factionsAndShips[0];
        var ships = factionsAndShips[1];
        factions.forEach(x => x.diplomacy.initializeForFactions(factions));
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(-viewDimension, 0, 0)), null // entitiesInViewSort
        );
        var returnValue = new WorldExtended(worldName, DateTime.now(), activityDefns, buildableDefns._All, deviceDefns, technologyGraph, network, factions, ships, camera);
        return returnValue;
    }
    static create_DeviceDefns() {
        return DeviceDefns.Instance()._All;
    }
    static create_FactionsAndShips(universe, network, technologyGraph, buildableDefns, deviceDefnsByName, factionCount, factionDefnNameForPlayer) {
        var factions = new Array();
        var ships = new Array();
        // hack
        var worldDummy = new WorldExtended("WorldDummy", // name
        DateTime.now(), // dateCreated
        [], // activityDefns
        buildableDefns._All, [], // deviceDefns
        technologyGraph, network, // network
        factions, ships, // ships
        null // camera
        );
        universe.world = worldDummy;
        var colors = Color.Instances();
        var colorsForFactions = [
            colors.Red,
            colors.Orange,
            colors.YellowDark,
            colors.Green,
            colors.Cyan,
            colors.Violet,
            colors.Gray
        ];
        var factionDefnsAll = FactionDefn.Instances()._All;
        var factionDefnsAllMinusPlayerSelection = factionDefnsAll.map(x => x);
        if (factionDefnNameForPlayer != null) {
            var factionDefnForPlayer = factionDefnsAll.find(x => x.name == factionDefnNameForPlayer);
            factionDefnsAllMinusPlayerSelection.splice(factionDefnsAll.indexOf(factionDefnForPlayer), 1);
        }
        var randomizer = RandomizerSystem.Instance();
        var factionDefnsToChooseFrom = randomizer.chooseNElementsFromArray(factionCount, factionDefnsAllMinusPlayerSelection);
        for (var i = 0; i < factionCount; i++) {
            WorldExtended.create_FactionsAndShips_1(universe, worldDummy, network, colorsForFactions, factionDefnsToChooseFrom, technologyGraph, buildableDefns, deviceDefnsByName, i, ships);
        }
        if (factionDefnNameForPlayer != null) {
            factions[0].defnName = factionDefnNameForPlayer;
        }
        var communicationStyleNames = [
            "Chivalrous",
            "Enthusiastic",
            "Haughty",
            "Poetic",
            "Robotic",
            "Unctuous",
            "Unhinged"
        ];
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i];
            var communicationStyleIndex = Math.floor(Math.random() * communicationStyleNames.length);
            var communicationStyleName = communicationStyleNames[communicationStyleIndex];
            faction.diplomacy.communicationStyleName =
                communicationStyleName;
            communicationStyleNames.splice(communicationStyleNames.indexOf(communicationStyleName), 1);
        }
        if (WorldExtended.isDebuggingMode) {
            WorldExtended.create_FactionsAndShips_2_ShipEnemy(universe, worldDummy, factions, deviceDefnsByName);
        }
        var factionsAndShips = [factions, ships];
        return factionsAndShips;
    }
    static create_FactionsAndShips_1(universe, worldDummy, network, colorsForFactions, factionDefnsToChooseFrom, technologyGraph, buildableDefns, deviceDefnsByName, i, ships) {
        var factionIntelligenceAutomated = FactionIntelligence.demo();
        var factionHomeStarsystem = null;
        var numberOfNetworkNodes = network.nodes.length;
        var random = Math.random();
        var starsystemIndexStart = Math.floor(random * numberOfNetworkNodes);
        var starsystemIndex = starsystemIndexStart;
        while (factionHomeStarsystem == null) {
            var node = network.nodes[starsystemIndex];
            factionHomeStarsystem = node.starsystem;
            if (factionHomeStarsystem.planets.length == 0) {
                factionHomeStarsystem = null;
            }
            else if (factionHomeStarsystem.factionName != null) {
                factionHomeStarsystem = null;
            }
            starsystemIndex++;
            if (starsystemIndex >= numberOfNetworkNodes) {
                starsystemIndex = 0;
            }
            if (starsystemIndex == starsystemIndexStart) {
                throw "There are more factions than starsystems with planets.";
            }
        }
        var factionName = factionHomeStarsystem.name + "ians";
        factionHomeStarsystem.factionSetByName(factionName);
        var factionColor = colorsForFactions[i];
        var factionDiplomacy = FactionDiplomacy.fromFactionSelfName(factionName);
        var technologiesKnown = technologyGraph.technologiesFree();
        var technologiesKnownNames = technologiesKnown.map((x) => x.name);
        var factionTechnologyResearcher = new TechnologyResearcher(factionName, null, // nameOfTechnologyBeingResearched,
        0, // researchAccumulated
        technologiesKnownNames);
        if (WorldExtended.isDebuggingMode) {
            var technologiesToLearnNames = [
                "Orbital Structures",
                "Interplanetary Exploration",
                "Tonklin Diary",
                "Xenobiology",
                "Environmental Encapsulation",
                "Spectral Analysis",
                "Superconductivity",
                "Spacetime Surfing"
            ];
            technologiesToLearnNames.forEach(x => factionTechnologyResearcher.technologyLearnByName(x));
            factionTechnologyResearcher.technologyBeingResearcedSetToFirstAvailable(worldDummy);
        }
        var factionDefn = factionDefnsToChooseFrom[i];
        var factionHomePlanet = WorldExtended.create_FactionsAndShips_1_1_HomePlanet(universe, worldDummy, buildableDefns, factionHomeStarsystem, factionName, factionDefn);
        var factionShips = new Array();
        var faction = new Faction(factionName, factionDefn.name, factionHomeStarsystem.name, factionHomePlanet.name, factionColor, factionDiplomacy, factionTechnologyResearcher, [factionHomePlanet], factionShips, new FactionKnowledge(factionName, // factionSelfName
        [factionName], // factionNames
        ships.map(x => x.id), // shipIds
        [factionHomeStarsystem.name], factionHomeStarsystem.links(network).map((x) => x.name)), factionIntelligence);
        WorldExtended.create_FactionsAndShips_1_2_Ships(universe, factionColor, factionHomeStarsystem, faction, deviceDefnsByName, factionShips);
        ships.push(...factionShips);
        var factionIntelligence = (i == 0 ? null : factionIntelligenceAutomated);
        worldDummy.factionAdd(faction);
        factionShips.forEach(ship => factionHomeStarsystem.shipAdd(ship, worldDummy));
    }
    static create_FactionsAndShips_1_1_HomePlanet(universe, worldDummy, buildableDefns, factionHomeStarsystem, factionName, factionDefn) {
        var planets = factionHomeStarsystem.planets;
        var planetIndexRandom = Math.floor(planets.length * Math.random());
        var factionHomePlanet = planets[planetIndexRandom];
        factionHomePlanet.factionable().factionSetByName(factionName);
        var factionHomePlanetType = PlanetType.byName(factionDefn.planetStartingTypeName);
        factionHomePlanet.planetType = factionHomePlanetType;
        factionHomePlanet.demographics.population = 1;
        var factionHomePlanetSizeInCells = factionHomePlanet.planetType.size.surfaceSizeInCells;
        var offsetForSurface = 3;
        var buildableDefnsToBuild = [
            buildableDefns.SurfaceColonyHub
        ];
        if (WorldExtended.isDebuggingMode) {
            var buildableDefnsForHeadStart = [
                buildableDefns.SurfaceAgriplot,
                buildableDefns.SurfaceFactory,
                buildableDefns.SurfaceLaboratory,
                buildableDefns.OrbitalShipyard
            ];
            buildableDefnsToBuild.push(...buildableDefnsForHeadStart);
            factionHomePlanet.populationAdd(universe, buildableDefnsForHeadStart.length + 1);
        }
        var factionHomePlanetLayoutMap = factionHomePlanet.layout(universe).map;
        for (var i = 0; i < buildableDefnsToBuild.length; i++) {
            var buildableDefn = buildableDefnsToBuild[i];
            var buildablePos;
            if (i == 0) {
                buildablePos =
                    factionHomePlanetSizeInCells.clone().half().floor().addXY(0, offsetForSurface);
            }
            else {
                buildablePos =
                    factionHomePlanet.cellPositionsAvailableToBuildBuildableDefn(universe, buildableDefn)[0];
            }
            var buildable = Buildable.fromDefnAndPosComplete(buildableDefn, buildablePos);
            var buildableAsEntity = buildable.toEntity(worldDummy);
            factionHomePlanetLayoutMap.bodyAdd(buildableAsEntity);
        }
        return factionHomePlanet;
    }
    static create_FactionsAndShips_1_2_Ships(universe, factionColor, factionHomeStarsystem, faction, deviceDefnsByName, factionShips) {
        var shipDefn = Ship.bodyDefnBuild(factionColor);
        var shipCount = (this.isDebuggingMode ? 2 : 0);
        for (var s = 0; s < shipCount; s++) {
            var ship = new Ship("Ship" + s, shipDefn, Coords.create().randomize(universe.randomizer).multiply(factionHomeStarsystem.size).multiplyScalar(2).subtract(factionHomeStarsystem.size), faction, [
                new Device(deviceDefnsByName.get("Ship Generator, Basic")),
                new Device(deviceDefnsByName.get("Ship Drive, Basic")),
                new Device(deviceDefnsByName.get("Ship Shield, Basic")),
                new Device(deviceDefnsByName.get("Ship Weapon, Basic")),
            ]);
            factionShips.push(ship);
        }
        return factionShips;
    }
    static create_FactionsAndShips_2_ShipEnemy(universe, worldDummy, factions, deviceDefnsByName) {
        var factionUser = factions[0];
        var factionUserHomeStarsystem = factionUser.starsystemHome(worldDummy);
        var factionEnemy = factions[1];
        var factionEnemyColor = factionEnemy.color;
        var factionEnemyShipDefn = Ship.bodyDefnBuild(factionEnemyColor);
        var shipEnemy = new Ship("ShipEnemy", factionEnemyShipDefn, Coords.create().randomize(universe.randomizer).multiply(factionUserHomeStarsystem.size).multiplyScalar(2).subtract(factionUserHomeStarsystem.size), factionEnemy, [
            new Device(deviceDefnsByName.get("Ship Generator, Basic")),
            new Device(deviceDefnsByName.get("Ship Drive, Basic")),
            new Device(deviceDefnsByName.get("Ship Shield, Basic")),
            new Device(deviceDefnsByName.get("Ship Weapon, Basic")),
        ]);
        factionEnemy.shipAdd(shipEnemy);
        factionUserHomeStarsystem.shipAdd(shipEnemy, worldDummy);
    }
    // instance methods
    activityDefnByName(activityDefnName) {
        return this.defn.activityDefnByName(activityDefnName);
    }
    buildableDefnAdd(buildableDefn) {
        this.buildableDefns.push(buildableDefn);
        this.buildableDefnsByName.set(buildableDefn.name, buildableDefn);
    }
    buildableDefnByName(buildableDefnName) {
        return this.buildableDefnsByName.get(buildableDefnName);
    }
    buildableDefnRemove(buildableDefn) {
        this.buildableDefns.splice(this.buildableDefns.indexOf(buildableDefn), 1);
        this.buildableDefnsByName.delete(buildableDefn.name);
    }
    deviceDefnByName(deviceDefnName) {
        return this.deviceDefnsByName.get(deviceDefnName);
    }
    factionAdd(faction) {
        this.factions.push(faction);
        this.factionsByName.set(faction.name, faction);
    }
    factionByName(factionName) {
        return this.factionsByName.get(factionName);
    }
    factionCurrent() {
        return this.factions[this.factionIndexCurrent];
    }
    factionsOtherThanCurrent() {
        return this.factionsOtherThan(this.factionCurrent());
    }
    factionsOtherThan(faction) {
        return this.factions.filter(x => x.name != faction.name);
    }
    initialize(uwpe) {
        // Do nothing.
    }
    isAdvancingThroughRoundsUntilNotification() {
        return this._isAdvancingThroughRoundsUntilNotification;
    }
    mapCellSizeInPixels(universe) {
        if (this._mapCellSizeInPixels == null) {
            var viewSize = universe.display.sizeInPixels;
            this._mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0);
        }
        return this._mapCellSizeInPixels;
    }
    notificationsExist() {
        var faction = this.factionCurrent();
        var notificationSession = faction.notificationSession;
        var areThereAnyNotifications = notificationSession.notificationsExist();
        return areThereAnyNotifications;
    }
    placeForEntityLocatable(entityLocatable) {
        return this.network.placeForEntityLocatable(entityLocatable);
    }
    roundAdvanceUntilNotificationDisable() {
        this._isAdvancingThroughRoundsUntilNotification = false;
    }
    roundAdvanceUntilNotificationToggle(uwpe) {
        this._isAdvancingThroughRoundsUntilNotification =
            (this._isAdvancingThroughRoundsUntilNotification == false);
    }
    roundNumberCurrent() {
        return this.roundsSoFar + 1;
    }
    toVenue() {
        return new VenueWorldExtended(this);
    }
    updateForRound(uwpe) {
        var universe = uwpe.universe;
        var factionCurrent = this.factionCurrent();
        var notificationsBlocking = factionCurrent.notificationsForRoundAddToArray(universe, []);
        if (notificationsBlocking.length > 0) {
            this.roundAdvanceUntilNotificationDisable();
            factionCurrent.notificationsAdd(notificationsBlocking);
            factionCurrent.notificationSessionStart(universe);
        }
        else {
            uwpe.world = this;
            var world = universe.world;
            this.network.updateForRound(universe, world);
            this.factions.forEach(x => x.updateForRound(universe, world));
            this.roundsSoFar++;
        }
    }
    updateForTimerTick(uwpe) {
        //super.updateForTimerTick(uwpe);
        var isFastForwarding = this.isAdvancingThroughRoundsUntilNotification();
        if (isFastForwarding) {
            var world = this;
            var factionCurrent = world.factionCurrent();
            var areThereAnyNotifications = factionCurrent.notificationsExist();
            if (areThereAnyNotifications) {
                this.roundAdvanceUntilNotificationToggle(uwpe);
                factionCurrent.notificationSessionStart(uwpe.universe);
            }
            else {
                world.updateForRound(uwpe);
            }
        }
    }
}
WorldExtended.isDebuggingMode = true;
