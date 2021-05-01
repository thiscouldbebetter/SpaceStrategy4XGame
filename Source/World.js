"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, technologyTree, network, factions, ships, camera) {
        super(name, dateCreated, null, // worldDefn
        [] // places
        );
        this.activityDefns = activityDefns;
        this.activityDefnsByName =
            ArrayHelper.addLookupsByName(this.activityDefns);
        this.buildableDefns = buildableDefns;
        this.buildableDefnsByName =
            ArrayHelper.addLookupsByName(this.buildableDefns);
        this.technologyTree = technologyTree;
        this.network = network;
        this.factions = factions;
        this.ships = ships;
        this.camera = camera;
        this.dateSaved = this.dateCreated;
        this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
        this.shipsByName = ArrayHelper.addLookupsByName(this.ships);
        this.turnsSoFar = 0;
        this.factionIndexCurrent = 0;
    }
    // static methods
    static create(universe) {
        var worldName = NameGenerator.generateName() + " Cluster";
        var mapCellSizeInPixels = Coords.fromXY(20, 20); // hack
        var terrainNamesOrbit = ["Orbit"];
        var terrainNamesSurface = ["Surface"];
        var buildableDefns = [
            new BuildableDefn("Hub", terrainNamesSurface, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Gray"), null, null),
                VisualText.fromTextAndColor("H", Color.byName("White"))
            ]), [new Resource("Industry", 100)], // resourcesToBuild
            // resourcesProducedPerTurn
            [
                new Resource("Industry", 1),
                new Resource("Prosperity", 1)
            ]),
            new BuildableDefn("Factory", terrainNamesSurface, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Red"), null, null),
                VisualText.fromTextAndColor("F", Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [new Resource("Industry", 1)] // resourcesPerTurn
            ),
            new BuildableDefn("Laboratory", terrainNamesSurface, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Blue"), null, null),
                VisualText.fromTextAndColor("L", Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [new Resource("Research", 1)] // resourcesPerTurn
            ),
            new BuildableDefn("Plantation", terrainNamesSurface, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Green"), null, null),
                VisualText.fromTextAndColor("P", Color.byName("White"))
            ]), [new Resource("Industry", 30)], // resourcesToBuild
            [new Resource("Prosperity", 1)] // resourcesPerTurn
            ),
            new BuildableDefn("Ship", terrainNamesOrbit, new VisualGroup([
                Ship.visual(Color.byName("Gray")),
                VisualText.fromTextAndColor("Ship", Color.byName("White"))
            ]), [new Resource("Industry", 1)], // resourcesToBuild
            [] // resourcesPerTurn
            ),
            new BuildableDefn("Shipyard", terrainNamesOrbit, new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, Color.byName("Orange"), null, null)
            ]), [new Resource("Industry", 1)], // resourcesToBuild
            [] // resourcesPerTurn
            ),
        ];
        var technologyTree = TechnologyTree.demo();
        var viewSize = universe.display.sizeInPixels.clone();
        var viewDimension = viewSize.y;
        var networkRadius = viewDimension * .25;
        var numberOfNetworkNodes = 12;
        var network = Network2.generateRandom(universe, worldName, NetworkNodeDefn.Instances()._All, numberOfNetworkNodes, 
        // minAndMaxDistanceOfNodesFromOrigin
        [networkRadius / 2, networkRadius], 20 // distanceBetweenNodesMin
        );
        var focalLength = viewDimension;
        viewSize.z = focalLength;
        var numberOfFactions = 6;
        var factions = [];
        var ships = [];
        var colors = Color.Instances();
        var colorsForFactions = [
            colors.Red,
            colors.Orange,
            colors.YellowDark,
            colors.Green,
            colors.Cyan,
            colors.Violet,
        ];
        var deviceDefns = [
            new DeviceDefn("Drive", false, // isActive
            false, // needsTarget
            ["Drive"], // categoryNames
            (u, w, p, e, device) => // init
             { }, (u, w, p, e, device) => // updateForTurn
             {
                var ship = e;
                ship.distancePerMove += 50;
                ship.energyPerMove += 1;
            }, (u, w, p, e, device) => // use
             {
                var ship = e;
                ship.energyThisTurn -= ship.energyPerMove;
            }),
            new DeviceDefn("Generator", false, // isActive
            false, // needsTarget
            ["Generator"], // categoryNames
            (u, w, p, e, device) => // init
             { }, (u, w, p, e, device) => // updateForTurn
             {
                var ship = e;
                ship.energyThisTurn += 10;
            }, (u, w, p, e, device) => // use
             {
                // Do nothing.
            }),
            new DeviceDefn("Shield", true, // isActive
            false, // needsTarget
            ["Shield"], // categoryNames
            (u, w, p, e, device) => // intialize
             {
                device.isActive = false;
            }, (u, w, p, e, device) => // updateForTurn
             {
                var ship = e;
                if (device.isActive) {
                    ship.energyThisTurn -= 1;
                    ship.shieldingThisTurn = 0;
                }
            }, (u, w, p, e, device) => // use
             {
                var ship = e;
                var device = ship.deviceSelected;
                if (device.isActive) {
                    device.isActive = false;
                    ship.energyThisTurn += 1;
                }
                else {
                    device.isActive = true;
                    ship.energyThisTurn -= 1;
                }
            }),
            new DeviceDefn("Weapon", true, // isActive
            true, // needsTarget
            ["Weapon"], // categoryNames
            (u, w, p, e, device) => // initialize
             {
                // todo
            }, (u, w, p, e, device) => // updateForTurn
             {
                device.usesThisTurn = 3;
            }, (u, w, p, e, device) => // use
             {
                if (device.usesThisTurn > 0) {
                    var target = device.target; // todo
                    if (target == null) {
                        var mustTargetBody = true;
                        var venue = universe.venueCurrent;
                        venue.cursor.set(e, "UseDevice", mustTargetBody);
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
        var deviceDefnsByName = ArrayHelper.addLookupsByName(deviceDefns);
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
            var buildable = new Buildable("Hub", Coords.fromXY(4, 4), true);
            var buildableAsEntity = new Entity(buildable.defnName, [buildable]);
            factionHomePlanet.layout.map.bodies.push(buildableAsEntity);
            var factionShips = [];
            var shipDefn = Ship.bodyDefnBuild(factionColor);
            var shipCount = 2;
            for (var s = 0; s < shipCount; s++) {
                var ship = new Ship(factionName + " Ship" + s, shipDefn, Coords.create().randomize(universe.randomizer).multiply(factionHomeStarsystem.size).multiplyScalar(2).subtract(factionHomeStarsystem.size), factionName, [
                    new Device(deviceDefnsByName.get("Generator")),
                    new Device(deviceDefnsByName.get("Drive")),
                    new Device(deviceDefnsByName.get("Shield")),
                    new Device(deviceDefnsByName.get("Weapon")),
                ]);
                ships.push(ship);
                factionShips.push(ship);
                factionHomeStarsystem.shipAdd(ship);
            }
            var faction = new Faction(factionName, factionHomeStarsystem.name, factionColor, [], // relationships
            new TechnologyResearcher(factionName, null, // nameOfTechnologyBeingResearched,
            0, // researchAccumulated
            // namesOfTechnologiesKnown
            ["A"]), [
                factionHomeStarsystem.planets[0]
            ], factionShips, new FactionKnowledge([factionName], [factionHomeStarsystem.name], factionHomeStarsystem.links(network).map((x) => x.name)));
            factions.push(faction);
        }
        DiplomaticRelationship.initializeForFactions(factions);
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(-viewDimension, 0, 0)), null // entitiesInViewSort
        );
        var returnValue = new WorldExtended(worldName, DateTime.now(), ActivityDefn.Instances()._All, buildableDefns, technologyTree, network, factions, ships, camera);
        return returnValue;
    }
    // instance methods
    activityDefnByName(activityDefnName) {
        return this.activityDefnsByName.get(activityDefnName);
    }
    buildableDefnByName(buildableDefnName) {
        return this.buildableDefnsByName.get(buildableDefnName);
    }
    factionByName(factionName) {
        return this.factionsByName.get(factionName);
    }
    factionCurrent() {
        return this.factions[this.factionIndexCurrent];
    }
    factionsOtherThanCurrent() {
        var returnValues = this.factions.slice();
        ArrayHelper.removeAt(returnValues, this.factionIndexCurrent);
        return returnValues;
    }
    initialize(universe) {
        if (this.turnsSoFar == 0) {
            this.updateForTurn(universe);
        }
    }
    toVenue() {
        return new VenueWorldExtended(this);
    }
    updateForTurn(universe) {
        var factionForPlayer = this.factions[0];
        var notifications = factionForPlayer.notificationSession.notifications;
        if (this.turnsSoFar > 0 && notifications.length > 0) {
            factionForPlayer.notificationSessionStart(universe);
        }
        else {
            this.network.updateForTurn(universe, this);
            for (var i = 0; i < this.factions.length; i++) {
                var faction = this.factions[i];
                faction.updateForTurn(universe, this);
            }
            if (this.turnsSoFar > 1 && notifications.length > 0) {
                factionForPlayer.notificationSessionStart(universe);
            }
            this.turnsSoFar++;
        }
    }
}
