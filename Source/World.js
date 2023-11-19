"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, deviceDefns, technologyGraph, network, factions, ships, camera) {
        super(name, dateCreated, new WorldDefn([
            activityDefns
        ]), // worldDefn
        (placeName) => {
            return this.places.find(x => x.name == placeName);
        }, // placeGetByName
        network.name);
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
        this.turnsSoFar = 0;
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
        var worldName = NameGenerator.generateName() + " Cluster";
        var activityDefns = ArrayHelper.flattenArrayOfArrays([
            new ActivityDefn_Instances2()._All,
            ActivityDefn.Instances()._All
        ]);
        var buildableDefns = WorldExtended.create_BuildableDefns();
        var technologyGraph = TechnologyGraph.demo();
        var technologiesFree = technologyGraph.technologiesFree();
        var viewSize = universe.display.sizeInPixels.clone();
        var viewDimension = viewSize.y;
        var networkRadius = viewDimension * .25;
        var network = Network2.generateRandom(universe, worldName, NetworkNodeDefn.Instances()._All, starsystemCount).scale(networkRadius);
        var focalLength = viewDimension;
        viewSize.z = focalLength;
        var deviceDefns = WorldExtended.create_DeviceDefns();
        var deviceDefnsByName = ArrayHelper.addLookupsByName(deviceDefns);
        var factionsAndShips = WorldExtended.create_FactionsAndShips(universe, network, technologiesFree, buildableDefns, deviceDefnsByName, factionCount);
        var factions = factionsAndShips[0];
        var ships = factionsAndShips[1];
        factions.forEach(x => x.diplomacy.initializeForFactions(factions));
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(-viewDimension, 0, 0)), null // entitiesInViewSort
        );
        var returnValue = new WorldExtended(worldName, DateTime.now(), activityDefns, buildableDefns, deviceDefns, technologyGraph, network, factions, ships, camera);
        return returnValue;
    }
    static create_BuildableDefns() {
        return new BuildableDefnsBasic()._All;
    }
    static create_DeviceDefns() {
        return DeviceDefns.Instance()._All;
    }
    static create_FactionsAndShips(universe, network, technologiesFree, buildableDefns, deviceDefnsByName, numberOfFactions) {
        var factions = new Array();
        var ships = new Array();
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
        var numberOfNetworkNodes = network.nodes.length;
        var worldDummy = new WorldExtended("WorldDummy", // name
        DateTime.now(), // dateCreated
        [], // activityDefns
        buildableDefns, [], // deviceDefns
        null, // technologyGraph
        network, // network
        factions, ships, // ships
        null);
        var factionIntelligenceAutomated = FactionIntelligence.demo();
        for (var i = 0; i < numberOfFactions; i++) {
            var factionHomeStarsystem = null;
            var random = Math.random();
            var starsystemIndexStart = Math.floor(random * numberOfNetworkNodes);
            var starsystemIndex = starsystemIndexStart;
            while (factionHomeStarsystem == null) {
                factionHomeStarsystem =
                    network.nodes[starsystemIndex].starsystem;
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
            var planets = factionHomeStarsystem.planets;
            var planetIndexRandom = Math.floor(planets.length * Math.random());
            var factionHomePlanet = planets[planetIndexRandom];
            factionHomePlanet.factionable().factionSetByName(factionName);
            factionHomePlanet.demographics.population = 1;
            var buildable = new Buildable("Colony Hub", Coords.fromXY(4, 4), true);
            var buildableAsEntity = buildable.toEntity(worldDummy);
            factionHomePlanet.layout.map.bodies.push(buildableAsEntity);
            var factionShips = [];
            var shipDefn = Ship.bodyDefnBuild(factionColor);
            var shipCount = 2;
            for (var s = 0; s < shipCount; s++) {
                var ship = new Ship("Ship" + s, shipDefn, Coords.create().randomize(universe.randomizer).multiply(factionHomeStarsystem.size).multiplyScalar(2).subtract(factionHomeStarsystem.size), factionName, [
                    new Device(deviceDefnsByName.get("Ship Generator, Basic")),
                    new Device(deviceDefnsByName.get("Ship Drive, Basic")),
                    new Device(deviceDefnsByName.get("Ship Shield, Basic")),
                    new Device(deviceDefnsByName.get("Ship Weapon, Basic")),
                ]);
                ships.push(ship);
                factionShips.push(ship);
            }
            var factionIntelligence = (i == 0 ? null : factionIntelligenceAutomated);
            var faction = new Faction(factionName, factionHomeStarsystem.name, factionHomePlanet.name, factionColor, factionDiplomacy, new TechnologyResearcher(factionName, null, // nameOfTechnologyBeingResearched,
            0, // researchAccumulated
            // namesOfTechnologiesKnown
            technologiesFree.map(x => x.name)), [factionHomePlanet], factionShips, new FactionKnowledge(factionName, // factionSelfName
            [factionName], // factionNames
            ships.map(x => x.id), // shipIds
            [factionHomeStarsystem.name], factionHomeStarsystem.links(network).map((x) => x.name)), factionIntelligence);
            worldDummy.factionAdd(faction);
            factionShips.forEach(ship => factionHomeStarsystem.shipAdd(ship, worldDummy));
        }
        var communicationStyleNames = [
            "Chivalrous",
            "Enthusiastic",
            "Haughty",
            "Poetic",
            "Robotic",
            "Unctuous",
            "Unhinged",
        ];
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i];
            var communicationStyleIndex = Math.floor(Math.random() * communicationStyleNames.length);
            var communicationStyleName = communicationStyleNames[communicationStyleIndex];
            faction.diplomacy.communicationStyleName =
                communicationStyleName;
            communicationStyleNames.splice(communicationStyleNames.indexOf(communicationStyleName), 1);
        }
        var factionUser = factions[0];
        var factionUserHomeStarsystem = factionUser.starsystemHome(worldDummy);
        var factionEnemy = factions[1];
        var shipEnemy = new Ship("ShipEnemy", shipDefn, Coords.create().randomize(universe.randomizer).multiply(factionUserHomeStarsystem.size).multiplyScalar(2).subtract(factionUserHomeStarsystem.size), factionEnemy.name, [
            new Device(deviceDefnsByName.get("Ship Generator, Basic")),
            new Device(deviceDefnsByName.get("Ship Drive, Basic")),
            new Device(deviceDefnsByName.get("Ship Shield, Basic")),
            new Device(deviceDefnsByName.get("Ship Weapon, Basic")),
        ]);
        factionEnemy.shipAdd(shipEnemy);
        factionUserHomeStarsystem.shipAdd(shipEnemy, worldDummy);
        var factionsAndShips = [factions, ships];
        return factionsAndShips;
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
        if (this.turnsSoFar == 0) {
            this.updateForTurn(uwpe);
        }
    }
    placeForEntityLocatable(entityLocatable) {
        return this.network.placeForEntityLocatable(entityLocatable);
    }
    toVenue() {
        return new VenueWorldExtended(this);
    }
    turnAdvanceUntilNotification(uwpe) {
        var world = this;
        var factionForPlayer = world.factions[0];
        var notificationSession = factionForPlayer.notificationSession;
        var notifications = notificationSession.notifications;
        if (notifications.length > 0) {
            world.updateForTurn(uwpe);
        }
        else {
            while (notifications.length == 0) {
                world.updateForTurn(uwpe);
            }
        }
    }
    updateForTurn(uwpe) {
        uwpe.world = this;
        var universe = uwpe.universe;
        var factionForPlayer = this.factions[0];
        var notifications = factionForPlayer.notificationSession.notifications;
        if (this.turnsSoFar > 0 && notifications.length > 0) {
            factionForPlayer.notificationSessionStart(universe);
        }
        else {
            this.updateForTurn_IgnoringNotifications(universe);
        }
    }
    updateForTurn_IgnoringNotifications(universe) {
        this.network.updateForTurn(universe, this);
        for (var i = 0; i < this.factions.length; i++) {
            var faction = this.factions[i];
            faction.updateForTurn(universe, this);
        }
        this.turnsSoFar++;
    }
}
class BuildableDefnsBasic {
    constructor() {
        var mapCellSizeInPixels = Coords.fromXY(20, 20); // hack
        var fontHeight = mapCellSizeInPixels.y / 2;
        var terrainNamesOrbit = ["Orbit"];
        var terrainNamesSurface = ["Surface"];
        var colors = Color.Instances();
        var visualBuild = (labelText, color) => {
            return new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, color, null, null),
                VisualText.fromTextHeightAndColor(labelText, fontHeight, colors.White)
            ]);
        };
        var industryToBuild = (amount) => [new Resource("Industry", amount)];
        this.ColonyHub = new BuildableDefn("Colony Hub", true, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visualBuild("H", colors.Gray), industryToBuild(100), 
        // resourcesProducedPerTurn
        [
            new Resource("Industry", 1),
            new Resource("Prosperity", 1)
        ], null // entityModifyOnBuild
        );
        this.Factory = new BuildableDefn("Factory", false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visualBuild("F", colors.Red), industryToBuild(30), [new Resource("Industry", 1)], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.Laboratory = new BuildableDefn("Laboratory", false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visualBuild("L", colors.Blue), industryToBuild(30), [new Resource("Research", 1)], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.Plantation = new BuildableDefn("Plantation", false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visualBuild("P", colors.Green), industryToBuild(30), [new Resource("Prosperity", 1)], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipDriveBasic = new BuildableDefn("Ship Drive, Basic", true, // isItem
        terrainNamesOrbit, mapCellSizeInPixels, visualBuild("Drive", colors.Gray), industryToBuild(30), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipGeneratorBasic = new BuildableDefn("Ship Generator, Basic", true, // isItem
        terrainNamesOrbit, mapCellSizeInPixels, visualBuild("Generator", colors.Gray), industryToBuild(30), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHullSmall = new BuildableDefn("Ship Hull, Small", true, // isItem
        terrainNamesOrbit, mapCellSizeInPixels, visualBuild("Hull", colors.Gray), industryToBuild(30), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipShieldBasic = new BuildableDefn("Ship Shield, Basic", true, // isItem
        terrainNamesOrbit, mapCellSizeInPixels, visualBuild("Shield", colors.Gray), industryToBuild(30), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipWeaponBasic = new BuildableDefn("Ship Weapon, Basic", true, // isItem
        terrainNamesOrbit, mapCellSizeInPixels, visualBuild("Weapon", colors.Gray), industryToBuild(30), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.Shipyard = new BuildableDefn("Shipyard", false, // isItem
        terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(mapCellSizeInPixels, Color.byName("Orange"))
        ]), industryToBuild(100), [], // resourcesPerTurn
        // entityModifyOnBuild
        (entity) => entity.propertyAdd(new Shipyard()));
        this._All =
            [
                this.ColonyHub,
                this.Factory,
                this.Laboratory,
                this.Plantation,
                this.ShipDriveBasic,
                this.ShipGeneratorBasic,
                this.ShipHullSmall,
                this.ShipShieldBasic,
                this.ShipWeaponBasic,
                this.Shipyard
            ];
    }
}
