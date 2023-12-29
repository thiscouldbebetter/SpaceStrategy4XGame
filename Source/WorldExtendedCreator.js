"use strict";
class WorldExtendedCreator {
    constructor(universe, worldCreator) {
        this.universe = universe;
        this.worldCreator = worldCreator;
        this.isDebuggingMode = true;
    }
    create() {
        var settings = this.worldCreator.settings;
        var starsystemCount = parseInt(settings.starsystemCount);
        var factionCount = parseInt(settings.factionCount);
        var factionDefnNameForPlayer = settings.factionDefnName;
        var factionColorForPlayer = settings.factionColor || Faction.colors()[0];
        var worldName = NameGenerator.generateName() + " Cluster";
        var activityDefns = ArrayHelper.flattenArrayOfArrays([
            new ActivityDefn_Instances2()._All,
            ActivityDefn.Instances()._All
        ]);
        var viewSize = this.universe.display.sizeInPixels.clone();
        var mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0); // hack
        var buildableDefns = 
        // new BuildableDefnsBasic(mapCellSizeInPixels)._All;
        BuildableDefnsLegacy.Instance(mapCellSizeInPixels);
        var technologyGraph = 
        // TechnologyGraph.demo(mapCellSizeInPixels);
        TechnologyGraph.legacy(mapCellSizeInPixels, buildableDefns);
        var viewDimension = viewSize.y;
        var starClusterRadius = viewDimension * .25;
        var starCluster = StarCluster.generateRandom(this.universe, worldName, StarClusterNodeDefn.Instances()._All, starsystemCount).scale(starClusterRadius);
        var focalLength = viewDimension;
        viewSize.z = focalLength;
        var factionsAndShips = this.create_FactionsAndShips(starCluster, technologyGraph, buildableDefns, factionCount, factionDefnNameForPlayer, factionColorForPlayer);
        var factions = factionsAndShips[0];
        var ships = factionsAndShips[1];
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(-viewDimension, 0, 0)), null // entitiesInViewSort
        );
        var returnValue = new WorldExtended(worldName, DateTime.now(), activityDefns, buildableDefns._All, technologyGraph, starCluster, factions, ships, camera);
        return returnValue;
    }
    create_FactionsAndShips(starCluster, technologyGraph, buildableDefns, factionCount, factionDefnNameForPlayer, factionColorForPlayer) {
        var factions = new Array();
        var ships = new Array();
        // hack
        var worldDummy = new WorldExtended("WorldDummy", // name
        DateTime.now(), // dateCreated
        [], // activityDefns
        buildableDefns._All, technologyGraph, starCluster, factions, ships, // ships
        null // camera
        );
        this.universe.world = worldDummy;
        var colorsForFactions = Faction.colors();
        colorsForFactions.splice(colorsForFactions.indexOf(factionColorForPlayer), 1);
        colorsForFactions.splice(0, 0, factionColorForPlayer);
        var factionDefnsAll = FactionDefn.Instances()._All;
        var randomizer = RandomizerSystem.Instance();
        var factionDefns = randomizer.chooseNElementsFromArray(factionCount, factionDefnsAll);
        if (factionDefnNameForPlayer != null) {
            var factionDefnForPlayer = factionDefnsAll.find(x => x.name == factionDefnNameForPlayer);
            var factionDefnIndex = factionDefns.indexOf(factionDefnForPlayer);
            factionDefns.splice(factionDefnIndex, 1);
            factionDefns.splice(0, 0, factionDefnForPlayer);
        }
        for (var i = 0; i < factionCount; i++) {
            this.create_FactionsAndShips_1(worldDummy, starCluster, colorsForFactions, factionDefns, technologyGraph, buildableDefns, i, ships);
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
        if (this.isDebuggingMode) {
            this.create_FactionsAndShips_2_ShipOther(buildableDefns, worldDummy, factions);
        }
        var factionsAndShips = [factions, ships];
        return factionsAndShips;
    }
    create_FactionsAndShips_1(worldDummy, starCluster, colorsForFactions, factionDefns, technologyGraph, buildableDefns, i, ships) {
        var factionHomeStarsystem = null;
        var nodes = starCluster.nodes;
        var numberOfStarsystems = nodes.length;
        var random = Math.random();
        var starsystemIndexStart = Math.floor(random * numberOfStarsystems);
        var starsystemIndex = starsystemIndexStart;
        while (factionHomeStarsystem == null) {
            var node = nodes[starsystemIndex];
            factionHomeStarsystem = node.starsystem;
            if (factionHomeStarsystem.planets.length == 0) {
                factionHomeStarsystem = null;
            }
            else if (factionHomeStarsystem.factionName != null) {
                factionHomeStarsystem = null;
            }
            starsystemIndex++;
            if (starsystemIndex >= numberOfStarsystems) {
                starsystemIndex = 0;
            }
            if (starsystemIndex == starsystemIndexStart) {
                throw "There are more factions than starsystems with planets.";
            }
        }
        var factionDefn = factionDefns[i];
        var factionName = factionDefn.name;
        factionHomeStarsystem.factionSetByName(factionName);
        var factionColor = colorsForFactions[i];
        var technologiesKnown = technologyGraph.technologiesFree();
        var technologiesKnownNames = technologiesKnown.map((x) => x.name);
        var factionTechnologyResearcher = new TechnologyResearcher(null, // faction
        null, // nameOfTechnologyBeingResearched,
        0, // researchAccumulated
        technologiesKnownNames);
        if (this.isDebuggingMode) {
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
        var factionHomePlanet = this.create_FactionsAndShips_1_1_HomePlanet(worldDummy, buildableDefns, factionHomeStarsystem, factionDefn);
        var factionShips = new Array();
        var factionKnowledge = new FactionKnowledge(factionName, // factionSelfName
        [factionName], // factionNames
        ships.map(x => x.id), // shipIds
        [factionHomeStarsystem.name], factionHomeStarsystem.links(starCluster).map((x) => x.name));
        var factionIntelligences = FactionIntelligence.Instances();
        var factionIntelligence = (i == 0 ? factionIntelligences.Human : factionIntelligences.Computer);
        var shipHullSizes = ShipHullSize.Instances();
        var factionVisualsForHullSizesByName = new Map([
            [
                shipHullSizes.Small,
                Ship.visualForColorAndScaleFactor(factionColor, 5 // scaleFactor
                )
            ],
            [
                shipHullSizes.Medium,
                Ship.visualForColorAndScaleFactor(factionColor, 10 // scaleFactor
                )
            ],
            [
                shipHullSizes.Large,
                Ship.visualForColorAndScaleFactor(factionColor, 15 // scaleFactor
                )
            ],
            [
                shipHullSizes.Enormous,
                Ship.visualForColorAndScaleFactor(factionColor, 25 // scaleFactor
                )
            ]
        ]);
        var faction = new Faction(factionDefn.name, factionHomeStarsystem.name, factionHomePlanet.name, factionColor, null, // factionDiplomacy,
        factionTechnologyResearcher, [factionHomePlanet], factionShips, factionKnowledge, factionIntelligence, factionVisualsForHullSizesByName);
        factionHomePlanet.factionable().factionSet(faction);
        var factionDiplomacy = FactionDiplomacy.fromFactionSelf(faction);
        faction.diplomacy = factionDiplomacy;
        factionTechnologyResearcher.factionSet(faction);
        this.create_FactionsAndShips_1_2_Ships(buildableDefns, factionColor, factionHomeStarsystem, faction, factionShips, worldDummy);
        ships.push(...factionShips);
        worldDummy.factionAdd(faction);
        factionShips.forEach(ship => factionHomeStarsystem.shipAdd(ship, worldDummy));
    }
    create_FactionsAndShips_1_1_HomePlanet(worldDummy, buildableDefns, factionHomeStarsystem, factionDefn) {
        var universe = this.universe;
        var planets = factionHomeStarsystem.planets;
        var planetIndexRandom = Math.floor(planets.length * Math.random());
        var factionHomePlanet = planets[planetIndexRandom];
        var factionHomePlanetType = PlanetType.byName(factionDefn.planetStartingTypeName);
        factionHomePlanet.planetType = factionHomePlanetType;
        factionHomePlanet.demographics.population = 1;
        var factionHomePlanetSizeInCells = factionHomePlanet.planetType.size.surfaceSizeInCells;
        var offsetForSurface = 3;
        var buildableDefnsToBuild = [
            buildableDefns.SurfaceColonyHub
        ];
        if (this.isDebuggingMode) {
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
                // todo - Sometimes the cell at this pos has a non-buildable terrain.
                buildablePos =
                    factionHomePlanetSizeInCells.clone().half().floor().addXY(0, offsetForSurface);
            }
            else {
                // todo - Sometimes the hub is surrounded by non-buildable terrain.
                buildablePos =
                    factionHomePlanet.cellPositionsAvailableToBuildBuildableDefn(universe, buildableDefn)[0];
            }
            var buildable = Buildable.fromDefnAndPosComplete(buildableDefn, buildablePos);
            var buildableAsEntity = buildable.toEntity(worldDummy);
            factionHomePlanetLayoutMap.bodyAdd(buildableAsEntity);
        }
        return factionHomePlanet;
    }
    create_FactionsAndShips_1_2_Ships(buildableDefns, factionColor, factionHomeStarsystem, faction, factionShips, worldDummy) {
        var factionHomeStarsystemSize = factionHomeStarsystem.size();
        var shipHullSize = ShipHullSize.Instances().Medium;
        var shipDefn = Ship.bodyDefnBuild(factionColor);
        var shipCount = (this.isDebuggingMode ? 2 : 0);
        var shipComponentsAsBuildableDefns = [
            buildableDefns.ShipDrive1TonklinMotor,
            buildableDefns.ShipGenerator1ProtonShaver,
            buildableDefns.ShipGenerator1ProtonShaver,
            buildableDefns.ShipGenerator1ProtonShaver,
            buildableDefns.ShipGenerator1ProtonShaver,
            buildableDefns.ShipSensor1TonklinFrequencyAnalyzer,
            buildableDefns.ShipShield1IonWrap,
            buildableDefns.ShipWeapon01MassBarrageGun,
            buildableDefns.ShipStarlaneDrive1StarLaneDrive
        ];
        var shipComponentsAsBuildables = shipComponentsAsBuildableDefns.map(x => Buildable.fromDefn(x));
        var shipComponentsAsEntities = shipComponentsAsBuildables.map(x => x.toEntity(worldDummy));
        var randomizer = this.universe.randomizer;
        for (var s = 0; s < shipCount; s++) {
            var shipPos = Coords.create().randomize(randomizer).multiply(factionHomeStarsystemSize).multiplyScalar(2).subtract(factionHomeStarsystemSize);
            var ship = new Ship("Ship" + s, shipHullSize, shipDefn, shipPos, faction, shipComponentsAsEntities);
            factionShips.push(ship);
        }
        return factionShips;
    }
    create_FactionsAndShips_2_ShipOther(buildableDefns, worldDummy, factions) {
        var shipHullSize = ShipHullSize.Instances().Small;
        var factionUser = factions[0];
        var factionUserHomeStarsystem = factionUser.starsystemHome(worldDummy);
        var factionUserHomeStarsystemSize = factionUserHomeStarsystem.size();
        var factionOther = factions[1];
        var factionOtherColor = factionOther.color;
        var factionOtherShipDefn = Ship.bodyDefnBuild(factionOtherColor);
        var shipPos = Coords.create().randomize(this.universe.randomizer).multiply(factionUserHomeStarsystemSize).multiplyScalar(2).subtract(factionUserHomeStarsystemSize);
        var shipComponentsAsBuildableDefns = [
            buildableDefns.ShipDrive1TonklinMotor,
            buildableDefns.ShipGenerator1ProtonShaver,
            buildableDefns.ShipSensor1TonklinFrequencyAnalyzer,
            buildableDefns.ShipShield1IonWrap,
            buildableDefns.ShipWeapon01MassBarrageGun,
        ];
        var shipComponentsAsBuildables = shipComponentsAsBuildableDefns.map(x => Buildable.fromDefn(x));
        var shipComponentsAsEntities = shipComponentsAsBuildables.map(x => x.toEntity(worldDummy));
        var shipOther = new Ship("ShipOther", shipHullSize, factionOtherShipDefn, shipPos, factionOther, shipComponentsAsEntities);
        factionOther.shipAdd(shipOther);
        factionUserHomeStarsystem.shipAdd(shipOther, worldDummy);
    }
}
