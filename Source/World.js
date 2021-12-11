"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, deviceDefns, technologyTree, network, factions, ships, camera) {
        super(name, dateCreated, new WorldDefn(null, // actions
        activityDefns, null, null, null, null // ?
        ), // worldDefn
        [] // places
        );
        this.buildableDefns = buildableDefns;
        this.deviceDefns = deviceDefns;
        this.technologyTree = technologyTree;
        this.network = network;
        this.factions = factions;
        this.ships = ships;
        this.camera = camera;
        this.dateSaved = this.dateCreated;
        this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);
        this.deviceDefnsByName = ArrayHelper.addLookupsByName(this.deviceDefns);
        this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
        this.shipsByName = ArrayHelper.addLookupsByName(this.ships);
        this.defn.itemDefns.push(...deviceDefns);
        var buildableDefnsNonDevice = this.buildableDefns.filter(x => this.deviceDefnsByName.has(x.name) == false);
        var itemDefns = buildableDefnsNonDevice.map(x => ItemDefn.fromName(x.name));
        this.defn.itemDefns.push(...itemDefns);
        this.defn.itemDefnsByName = ArrayHelper.addLookupsByName(this.defn.itemDefns);
        this.turnsSoFar = 0;
        this.factionIndexCurrent = 0;
    }
    // static methods
    static create(universe) {
        var worldName = NameGenerator.generateName() + " Cluster";
        var activityDefns = ArrayHelper.flattenArrayOfArrays([
            new ActivityDefn_Instances2()._All,
            ActivityDefn.Instances()._All
        ]);
        var buildableDefns = WorldExtended.create_BuildableDefns();
        var technologyTree = TechnologyTree.demo();
        var technologiesFree = technologyTree.technologiesFree();
        var viewSize = universe.display.sizeInPixels.clone();
        var viewDimension = viewSize.y;
        var networkRadius = viewDimension * .25;
        var numberOfNetworkNodes = 12;
        var network = Network2.generateRandom(universe, worldName, NetworkNodeDefn.Instances()._All, numberOfNetworkNodes).scale(networkRadius);
        var focalLength = viewDimension;
        viewSize.z = focalLength;
        var deviceDefns = WorldExtended.create_DeviceDefns();
        var deviceDefnsByName = ArrayHelper.addLookupsByName(deviceDefns);
        var factionsAndShips = WorldExtended.create_FactionsAndShips(universe, network, technologiesFree, buildableDefns, deviceDefnsByName);
        var factions = factionsAndShips[0];
        var ships = factionsAndShips[1];
        DiplomaticRelationship.initializeForFactions(factions);
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(-viewDimension, 0, 0)), null // entitiesInViewSort
        );
        var returnValue = new WorldExtended(worldName, DateTime.now(), activityDefns, buildableDefns, deviceDefns, technologyTree, network, factions, ships, camera);
        return returnValue;
    }
    static create_BuildableDefns() {
        var mapCellSizeInPixels = Coords.fromXY(20, 20); // hack
        var fontHeight = mapCellSizeInPixels.y / 2;
        var terrainNamesOrbit = ["Orbit"];
        var terrainNamesSurface = ["Surface"];
        var buildableDefns = [
            new BuildableDefn("Colony Hub", true, // isItem
            terrainNamesSurface, mapCellSizeInPixels, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Gray"), null, null),
                VisualText.fromTextHeightAndColor("H", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 100)], // resourcesToBuild
            // resourcesProducedPerTurn
            [
                new Resource("Industry", 1),
                new Resource("Prosperity", 1)
            ], null // entityModifyOnBuild
            ),
            new BuildableDefn("Factory", false, // isItem
            terrainNamesSurface, mapCellSizeInPixels, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Red"), null, null),
                VisualText.fromTextHeightAndColor("F", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [new Resource("Industry", 1)], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Laboratory", false, // isItem
            terrainNamesSurface, mapCellSizeInPixels, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Blue"), null, null),
                VisualText.fromTextHeightAndColor("L", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [new Resource("Research", 1)], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Plantation", false, // isItem
            terrainNamesSurface, mapCellSizeInPixels, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Green"), null, null),
                VisualText.fromTextHeightAndColor("P", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [new Resource("Prosperity", 1)], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Ship Drive, Basic", true, // isItem
            terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
                Ship.visual(Color.byName("Gray")),
                VisualText.fromTextHeightAndColor("Drive", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Ship Generator, Basic", true, // isItem
            terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
                Ship.visual(Color.byName("Gray")),
                VisualText.fromTextHeightAndColor("Generator", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Ship Hull, Small", true, // isItem
            terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
                Ship.visual(Color.byName("Gray")),
                VisualText.fromTextHeightAndColor("Hull", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 50)], // resourcesToBuild
            [], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Ship Shield, Basic", true, // isItem
            terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
                Ship.visual(Color.byName("Gray")),
                VisualText.fromTextHeightAndColor("Shield", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Ship Weapon, Basic", true, // isItem
            terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
                Ship.visual(Color.byName("Gray")),
                VisualText.fromTextHeightAndColor("Small", fontHeight, Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [], // resourcesPerTurn
            null // entityModifyOnBuild
            ),
            new BuildableDefn("Shipyard", false, // isItem
            terrainNamesOrbit, mapCellSizeInPixels, new VisualGroup([
                VisualRectangle.fromSizeAndColorFill(mapCellSizeInPixels, Color.byName("Orange"))
            ]), [new Resource("Industry", 1)], // resourcesToBuild
            [], // resourcesPerTurn
            // entityModifyOnBuild
            (entity) => entity.propertyAdd(new Shipyard())),
        ];
        return buildableDefns;
    }
    static create_DeviceDefns() {
        var deviceDefns = [
            new DeviceDefn("Colony Hub", false, // isActive
            false, // needsTarget
            [], // categoryNames
            (uwpe) => // init
             { }, (uwpe) => // updateForTurn
             { }, (uwpe) => // use
             {
                var ship = uwpe.entity;
                ship.planetColonize(uwpe.universe, uwpe.world);
            }),
            new DeviceDefn("Ship Drive, Basic", false, // isActive
            false, // needsTarget
            ["Drive"], // categoryNames
            (uwpe) => // init
             { }, (uwpe) => // updateForTurn
             {
                var ship = uwpe.entity;
                ship.distancePerMove += 50;
                ship.energyPerMove += 1;
            }, (uwpe) => // use
             {
                var ship = uwpe.entity;
                ship.energyThisTurn -= ship.energyPerMove;
            }),
            new DeviceDefn("Ship Generator, Basic", false, // isActive
            false, // needsTarget
            ["Generator"], // categoryNames
            (uwpe) => // init
             { }, (uwpe) => // updateForTurn
             {
                var ship = uwpe.entity;
                ship.energyThisTurn += 10;
            }, (uwpe) => // use
             {
                // Do nothing.
            }),
            new DeviceDefn("Ship Shield, Basic", true, // isActive
            false, // needsTarget
            ["Shield"], // categoryNames
            (uwpe) => // intialize
             {
                var device = Device.fromEntity(uwpe.entity2);
                device.isActive = false;
            }, (uwpe) => // updateForTurn
             {
                var ship = uwpe.entity;
                var device = Device.fromEntity(uwpe.entity2);
                if (device.isActive) {
                    ship.energyThisTurn -= 1;
                    ship.shieldingThisTurn = 0;
                }
            }, (uwpe) => // use
             {
                var ship = uwpe.entity;
                var device = Device.fromEntity(uwpe.entity2);
                if (device.isActive) {
                    device.isActive = false;
                    ship.energyThisTurn += 1;
                }
                else {
                    device.isActive = true;
                    ship.energyThisTurn -= 1;
                }
            }),
            new DeviceDefn("Ship Weapon, Basic", true, // isActive
            true, // needsTarget
            ["Weapon"], // categoryNames
            (uwpe) => // initialize
             {
                // todo
            }, (uwpe) => // updateForTurn
             {
                var device = Device.fromEntity(uwpe.entity2);
                device.usesThisTurn = 3;
            }, (uwpe) => // use
             {
                var ship = uwpe.entity;
                var device = Device.fromEntity(uwpe.entity2);
                if (device.usesThisTurn > 0) {
                    var target = device.targetEntity; // todo
                    if (target == null) {
                        var venue = uwpe.universe.venueCurrent;
                        venue.cursor.entityAndOrderNameSet(ship, "UseDevice");
                    }
                    else // if (target != null)
                     {
                        device.usesThisTurn--;
                        var targetKillable = target.killable();
                        targetKillable.integrity -= 1;
                        if (targetKillable.integrity <= 0) {
                            alert("todo - ship destroyed");
                        }
                    }
                }
            }),
        ];
        return deviceDefns;
    }
    static create_FactionsAndShips(universe, network, technologiesFree, buildableDefns, deviceDefnsByName) {
        var numberOfFactions = 6;
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
        ];
        var numberOfNetworkNodes = network.nodes.length;
        var worldDummy = new WorldExtended("WorldDummy", // name
        DateTime.now(), // dateCreated
        [], // activityDefns
        buildableDefns, [], // deviceDefns
        null, // technologyTree
        null, // network
        [], // factions
        [], // ships
        null);
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
            factionHomeStarsystem.factionName = factionName;
            var factionColor = colorsForFactions[i];
            var planets = factionHomeStarsystem.planets;
            var planetIndexRandom = Math.floor(planets.length * Math.random());
            var factionHomePlanet = planets[planetIndexRandom];
            factionHomePlanet.factionName = factionName;
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
                factionHomeStarsystem.shipAdd(ship);
            }
            var faction = new Faction(factionName, factionHomeStarsystem.name, factionHomePlanet.name, factionColor, [], // relationships
            new TechnologyResearcher(factionName, null, // nameOfTechnologyBeingResearched,
            0, // researchAccumulated
            // namesOfTechnologiesKnown
            technologiesFree.map(x => x.name)), [factionHomePlanet], factionShips, new FactionKnowledge([factionName], [factionHomeStarsystem.name], factionHomeStarsystem.links(network).map((x) => x.name)));
            factions.push(faction);
        }
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
