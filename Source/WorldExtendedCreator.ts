
class WorldExtendedCreator
{
	universe: Universe;
	worldCreator: WorldCreator;

	isDebuggingMode: boolean;

	constructor(universe: Universe, worldCreator: WorldCreator)
	{
		this.universe = universe;
		this.worldCreator = worldCreator;

		this.isDebuggingMode = true;
	}

	create(): WorldExtended
	{
		var settings = this.worldCreator.settings;
		var starsystemCount = parseInt(settings.starsystemCount);
		var factionCount = parseInt(settings.factionCount);
		var factionDefnNameForPlayer = settings.factionDefnName;
		var factionColorForPlayer = settings.factionColor || Faction.colors()[0];

		var worldName = NameGenerator.generateName() + " Cluster";

		var activityDefns = ArrayHelper.flattenArrayOfArrays
		([
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

		var networkRadius = viewDimension * .25;
		var network = Network2.generateRandom
		(
			this.universe,
			worldName,
			NetworkNodeDefn.Instances()._All,
			starsystemCount
		).scale
		(
			networkRadius
		);

		var focalLength = viewDimension;
		viewSize.z = focalLength;

		var deviceDefns = this.create_DeviceDefns();
		var deviceDefnsByName = ArrayHelper.addLookupsByName(deviceDefns);

		var factionsAndShips = this.create_FactionsAndShips
		(
			network, 
			technologyGraph,
			buildableDefns,
			deviceDefnsByName,
			factionCount,
			factionDefnNameForPlayer,
			factionColorForPlayer
		);

		var factions = factionsAndShips[0];
		var ships = factionsAndShips[1];

		factions.forEach(x => x.diplomacy.initializeForFactions(factions));

		var camera = new Camera
		(
			viewSize,
			focalLength,
			Disposition.fromPos
			(
				new Coords(-viewDimension, 0, 0), //pos,
			),
			null // entitiesInViewSort
		);

		var returnValue = new WorldExtended
		(
			worldName,
			DateTime.now(),
			activityDefns,
			buildableDefns._All,
			deviceDefns,
			technologyGraph,
			network,
			factions,
			ships,
			camera
		);

		return returnValue;
	}

	create_DeviceDefns(): DeviceDefn[]
	{
		return DeviceDefns.Instance()._All;
	}

	create_FactionsAndShips
	(
		network: Network2,
		technologyGraph: TechnologyGraph,
		buildableDefns: BuildableDefnsLegacy,
		deviceDefnsByName: Map<string, DeviceDefn>,
		factionCount: number,
		factionDefnNameForPlayer: string,
		factionColorForPlayer: Color
	): [ Faction[], Ship[] ]
	{
		var factions = new Array<Faction>();
		var ships = new Array<Ship>();

		// hack
		var worldDummy = new WorldExtended
		(
			"WorldDummy", // name
			DateTime.now(), // dateCreated
			[], // activityDefns
			buildableDefns._All,
			[], // deviceDefns
			technologyGraph,
			network, // network
			factions,
			ships, // ships
			null // camera
		);
		this.universe.world = worldDummy;

		var colorsForFactions = Faction.colors();
		colorsForFactions.splice
		(
			colorsForFactions.indexOf(factionColorForPlayer),
			1
		);
		colorsForFactions.splice(0, 0, factionColorForPlayer);

		var factionDefnsAll = FactionDefn.Instances()._All;

		var randomizer = RandomizerSystem.Instance();
		var factionDefns =
			randomizer.chooseNElementsFromArray
			(
				factionCount,
				factionDefnsAll
			);

		if (factionDefnNameForPlayer != null)
		{
			var factionDefnForPlayer =
				factionDefnsAll.find(x => x.name == factionDefnNameForPlayer);
			var factionDefnIndex = factionDefns.indexOf(factionDefnForPlayer);
			factionDefns.splice(factionDefnIndex, 1);
			factionDefns.splice(0, 0, factionDefnForPlayer);
		}

		for (var i = 0; i < factionCount; i++)
		{
			this.create_FactionsAndShips_1
			(
				worldDummy,
				network,
				colorsForFactions,
				factionDefns,
				technologyGraph,
				buildableDefns,
				deviceDefnsByName,
				i,
				ships
			);
		}

		if (factionDefnNameForPlayer != null)
		{
			factions[0].defnName = factionDefnNameForPlayer;
		}

		var communicationStyleNames =
		[
			"Chivalrous",
			"Enthusiastic",
			"Haughty",
			"Poetic",
			"Robotic",
			"Unctuous",
			"Unhinged"
		];

		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			var communicationStyleIndex =
				Math.floor(Math.random() * communicationStyleNames.length);
			var communicationStyleName =
				communicationStyleNames[communicationStyleIndex];
			faction.diplomacy.communicationStyleName =
				communicationStyleName;

			communicationStyleNames.splice
			(
				communicationStyleNames.indexOf(communicationStyleName), 1
			);
		}

		if (this.isDebuggingMode)
		{
			this.create_FactionsAndShips_2_ShipOther
			(
				worldDummy, factions, deviceDefnsByName
			);
		}

		var factionsAndShips: [Faction[], Ship[]] = 
			[ factions, ships ];

		return factionsAndShips;
	}

	create_FactionsAndShips_1
	(
		worldDummy: WorldExtended,
		network: Network2,
		colorsForFactions: Color[],
		factionDefns: FactionDefn[],
		technologyGraph: TechnologyGraph,
		buildableDefns: BuildableDefnsLegacy,
		deviceDefnsByName: Map<string, DeviceDefn>,
		i: number,
		ships: Ship[]
	): void
	{
		var factionHomeStarsystem: Starsystem = null;

		var numberOfNetworkNodes = network.nodes.length;

		var random = Math.random();
		var starsystemIndexStart = Math.floor
		(
			random * numberOfNetworkNodes
		);

		var starsystemIndex = starsystemIndexStart;

		while (factionHomeStarsystem == null)
		{
			var node = network.nodes[starsystemIndex];
			factionHomeStarsystem = node.starsystem;

			if (factionHomeStarsystem.planets.length == 0)
			{
				factionHomeStarsystem = null;
			}
			else if (factionHomeStarsystem.factionName != null)
			{
				factionHomeStarsystem = null;
			}

			starsystemIndex++;
			if (starsystemIndex >= numberOfNetworkNodes)
			{
				starsystemIndex = 0;
			}

			if (starsystemIndex == starsystemIndexStart)
			{
				throw "There are more factions than starsystems with planets.";
			}
		}

		var factionName = factionHomeStarsystem.name + "ians";
		factionHomeStarsystem.factionSetByName(factionName);
		var factionColor = colorsForFactions[i];

		var factionDiplomacy = FactionDiplomacy.fromFactionSelfName(factionName);

		var technologiesKnown = technologyGraph.technologiesFree();
		var technologiesKnownNames = technologiesKnown.map((x: Technology) => x.name);

		var factionTechnologyResearcher = new TechnologyResearcher
		(
			factionName,
			null, // nameOfTechnologyBeingResearched,
			0, // researchAccumulated
			technologiesKnownNames
		);
		
		if (this.isDebuggingMode)
		{
			var technologiesToLearnNames =
			[
				"Orbital Structures",
				"Interplanetary Exploration",
				"Tonklin Diary",
				"Xenobiology",
				"Environmental Encapsulation",
				"Spectral Analysis",
				"Superconductivity",
				"Spacetime Surfing"
			];
			
			technologiesToLearnNames.forEach
			(
				x => factionTechnologyResearcher.technologyLearnByName(x)
			);
			
			factionTechnologyResearcher.technologyBeingResearcedSetToFirstAvailable(worldDummy);
		}

		var factionDefn = factionDefns[i];

		var factionHomePlanet = this.create_FactionsAndShips_1_1_HomePlanet
		(
			worldDummy,
			buildableDefns,
			factionHomeStarsystem,
			factionName,
			factionDefn
		);

		var factionShips = new Array<Ship>();

		var factionKnowledge = new FactionKnowledge
		(
			factionName, // factionSelfName
			[ factionName ], // factionNames
			ships.map(x => x.id), // shipIds
			[ factionHomeStarsystem.name ],
			factionHomeStarsystem.links(network).map
			(
				(x: NetworkLink2) => x.name
			)
		);

		var factionIntelligences = FactionIntelligence.Instances();
		var factionIntelligence =
			(i == 0 ? factionIntelligences.Human : factionIntelligences.Computer);

		var shipHullSizes = ShipHullSize.Instances();

		var factionVisualsForHullSizesByName = new Map<ShipHullSize, VisualBase>
		([
			[
				shipHullSizes.Small,
				Ship.visualForColorAndScaleFactor
				(
					factionColor, 5 // scaleFactor
				)
			],
			[
				shipHullSizes.Medium,
				Ship.visualForColorAndScaleFactor
				(
					factionColor, 10 // scaleFactor
				)
			],
			[
				shipHullSizes.Large,
				Ship.visualForColorAndScaleFactor
				(
					factionColor, 15 // scaleFactor
				)
			],
			[
				shipHullSizes.Enormous,
				Ship.visualForColorAndScaleFactor
				(
					factionColor, 25 // scaleFactor
				)
			]
		]);

		var faction = new Faction
		(
			factionName,
			factionDefn.name,
			factionHomeStarsystem.name,
			factionHomePlanet.name,
			factionColor,
			factionDiplomacy,
			factionTechnologyResearcher,
			[ factionHomePlanet ],
			factionShips,
			factionKnowledge,
			factionIntelligence,
			factionVisualsForHullSizesByName
		);

		this.create_FactionsAndShips_1_2_Ships
		(
			buildableDefns,
			factionColor,
			factionHomeStarsystem,
			faction,
			factionShips,
			worldDummy
		);

		ships.push(...factionShips);

		worldDummy.factionAdd(faction);

		factionShips.forEach
		(
			ship => factionHomeStarsystem.shipAdd(ship, worldDummy)
		);
	}

	create_FactionsAndShips_1_1_HomePlanet
	(
		worldDummy: WorldExtended,
		buildableDefns: BuildableDefnsLegacy,
		factionHomeStarsystem: Starsystem,
		factionName: string,
		factionDefn: FactionDefn
	)
	{
		var universe = this.universe;

		var planets = factionHomeStarsystem.planets;
		var planetIndexRandom = Math.floor(planets.length * Math.random());
		var factionHomePlanet = planets[planetIndexRandom];
		factionHomePlanet.factionable().factionSetByName(factionName);

		var factionHomePlanetType = PlanetType.byName(factionDefn.planetStartingTypeName);
		factionHomePlanet.planetType = factionHomePlanetType;

		factionHomePlanet.demographics.population = 1;

		var factionHomePlanetSizeInCells =
			factionHomePlanet.planetType.size.surfaceSizeInCells;
		var offsetForSurface = 3;

		var buildableDefnsToBuild =
		[
			buildableDefns.SurfaceColonyHub
		];
		
		if (this.isDebuggingMode)
		{
			var buildableDefnsForHeadStart =
			[
				buildableDefns.SurfaceAgriplot,
				buildableDefns.SurfaceFactory,
				buildableDefns.SurfaceLaboratory,
				buildableDefns.OrbitalShipyard
			];

			buildableDefnsToBuild.push(...buildableDefnsForHeadStart);

			factionHomePlanet.populationAdd
			(
				universe,
				buildableDefnsForHeadStart.length + 1
			);
		}
		
		var factionHomePlanetLayoutMap =
			factionHomePlanet.layout(universe).map;

		for (var i = 0; i < buildableDefnsToBuild.length; i++)
		{
			var buildableDefn = buildableDefnsToBuild[i];
			var buildablePos: Coords;
			if (i == 0)
			{
				// todo - Sometimes the cell at this pos has a non-buildable terrain.
				buildablePos =
					factionHomePlanetSizeInCells.clone().half().floor().addXY
					(
						0, offsetForSurface
					);
			}
			else
			{
				// todo - Sometimes the hub is surrounded by non-buildable terrain.
				buildablePos =
					factionHomePlanet.cellPositionsAvailableToBuildBuildableDefn
					(
						universe, buildableDefn
					)[0];
			}

			var buildable = Buildable.fromDefnAndPosComplete
			(
				buildableDefn,
				buildablePos
			);

			var buildableAsEntity = buildable.toEntity(worldDummy);
			
			factionHomePlanetLayoutMap.bodyAdd(buildableAsEntity);
		}

		return factionHomePlanet;
	}

	create_FactionsAndShips_1_2_Ships
	(
		buildableDefns: BuildableDefnsLegacy,
		factionColor: Color,
		factionHomeStarsystem: Starsystem,
		faction: Faction,
		factionShips: Ship[],
		worldDummy: WorldExtended
	): Ship[]
	{
		var factionHomeStarsystemSize = factionHomeStarsystem.size();

		var shipHullSize = ShipHullSize.Instances().Small;
		var shipDefn = Ship.bodyDefnBuild(factionColor);
		var shipCount = (this.isDebuggingMode ? 2 : 0);

		var shipComponentsAsBuildableDefns = 
		[
			buildableDefns.ShipDrive1TonklinMotor,
			buildableDefns.ShipGenerator1ProtonShaver,
			buildableDefns.ShipSensor1TonklinFrequencyAnalyzer,
			buildableDefns.ShipShield1IonWrap,
			buildableDefns.ShipWeapon01MassBarrageGun,
		];

		var shipComponentsAsBuildables =
			shipComponentsAsBuildableDefns.map(x => Buildable.fromDefn(x) );

		var shipComponentsAsEntities =
			shipComponentsAsBuildables.map(x => x.toEntity(worldDummy) );

		var randomizer = this.universe.randomizer;

		for (var s = 0; s < shipCount; s++)
		{
			var shipPos = Coords.create().randomize
			(
				randomizer
			).multiply
			(
				factionHomeStarsystemSize
			).multiplyScalar
			(
				2
			).subtract
			(
				factionHomeStarsystemSize
			);

			var ship = new Ship
			(
				"Ship" + s,
				shipHullSize,
				shipDefn,
				shipPos,
				faction,
				shipComponentsAsEntities
			);

			factionShips.push(ship);
		}

		return factionShips;
	}

	create_FactionsAndShips_2_ShipOther
	(
		worldDummy: WorldExtended,
		factions: Faction[],
		deviceDefnsByName: Map<string, DeviceDefn>
	): void
	{
		var shipHullSize = ShipHullSize.Instances().Small;

		var factionUser = factions[0];
		var factionUserHomeStarsystem =
			factionUser.starsystemHome(worldDummy);
		var factionUserHomeStarsystemSize =
			factionUserHomeStarsystem.size();

		var factionOther = factions[1];
		var factionOtherColor = factionOther.color;
		var factionOtherShipDefn = Ship.bodyDefnBuild(factionOtherColor);

		var shipPos = Coords.create().randomize
		(
			this.universe.randomizer
		).multiply
		(
			factionUserHomeStarsystemSize
		).multiplyScalar
		(
			2
		).subtract
		(
			factionUserHomeStarsystemSize
		);

		var shipOther = new Ship
		(
			"ShipOther",
			shipHullSize,
			factionOtherShipDefn,
			shipPos,
			factionOther,
			[
				// No devices.
			]
		);

		factionOther.shipAdd(shipOther);
		factionUserHomeStarsystem.shipAdd(shipOther, worldDummy);
	}

}