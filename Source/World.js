
class World
{
	constructor
	(
		name, dateCreated, activityDefns, buildables, technologyTree,
		network, factions, ships, camera
	)
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.activityDefns = activityDefns;
		this.activityDefnsByName =
			ArrayHelper.addLookupsByName(this.activityDefns);
		this.buildables = buildables;
		this.buildablesByName =
			ArrayHelper.addLookupsByName(this.buildables);
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

	static create(universe)
	{
		var worldName = NameGenerator.generateName() + " Cluster";

		var mapCellSizeInPixels = new Coords(20, 20); // hack

		var terrainNamesOrbit = [ "Orbit" ];
		var terrainNamesSurface = [ "Surface" ];

		var buildableDefns =
		[
			new BuildableDefn
			(
				"Hub",
				terrainNamesSurface,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, Color.byName("Gray")),
					VisualText.fromTextAndColor("H", Color.byName("White"))
				]),
				[ new Resource("Industry", 100) ], // resourcesToBuild
				// resourcesProducedPerTurn
				[
					new Resource("Industry", 1),
					new Resource("Prosperity", 1)
				]
			),
			new BuildableDefn
			(
				"Factory",
				terrainNamesSurface,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, Color.byName("Red")),
					VisualText.fromTextAndColor("F", Color.byName("White"))
				]),
				[ new Resource("Industry", 30) ], // resourcesToBuild
				[ new Resource("Industry", 1) ] // resourcesPerTurn
			),

			new BuildableDefn
			(
				"Laboratory",
				terrainNamesSurface,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, Color.byName("Blue")),
					VisualText.fromTextAndColor("L", Color.byName("White"))
				]),
				[ new Resource("Industry", 30) ], // resourcesToBuild
				[ new Resource("Research", 1) ] // resourcesPerTurn
			),

			new BuildableDefn
			(
				"Plantation",
				terrainNamesSurface,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, Color.byName("Green")),
					VisualText.fromTextAndColor("P", Color.byName("White"))
				]),
				[ new Resource("Industry", 30) ], // resourcesToBuild
				[ new Resource("Prosperity", 1) ] // resourcesPerTurn
			),

			new BuildableDefn
			(
				"Ship",
				terrainNamesOrbit,
				new VisualGroup
				([
					Ship.visual("Gray"),
					VisualText.fromTextAndColor("Ship", Color.byName("White"))
				]),
				[ new Resource("Industry", 1) ], // resourcesToBuild
				[] // resourcesPerTurn
			),

			new BuildableDefn
			(
				"Shipyard",
				terrainNamesOrbit,
				new VisualGroup([new VisualRectangle(mapCellSizeInPixels, "Orange")]),
				[ new Resource("Industry", 1) ], // resourcesToBuild
				[], // resourcesPerTurn
				function use(universe, world, starsystem, planet, buildable)
				{
					universe.venueNext = new VenueMessage
					(
						"todo - shipyard",
						function acknowledge(universe)
						{
							universe.venueNext = new VenueLayout(planet.layout);
						}
					);
				}
			),
		];

		var buildableDefnsByName = ArrayHelper.addLookupsByName(buildableDefns);

		var technologyTree = TechnologyTree.demo();

		var viewSize = universe.display.sizeInPixels.clone();
		var viewDimension = viewSize.y;

		var networkRadius = viewDimension * .25;
		var numberOfNetworkNodes = 12;
		var network = Network.generateRandom
		(
			universe,
			worldName,
			NetworkNodeDefn.Instances()._All,
			numberOfNetworkNodes,
			// minAndMaxDistanceOfNodesFromOrigin
			[ networkRadius / 2, networkRadius ],
			20 // distanceBetweenNodesMin
		);

		var focalLength = viewDimension;
		viewSize.z = focalLength;

		var numberOfFactions = 6;
		var factions = [];
		var ships = [];

		var colors = Color.Instances();
		var colorsForFactions =
		[
			colors.Red,
			colors.Orange,
			colors.YellowDark,
			colors.Green,
			colors.Cyan,
			colors.Violet,
		];

		var deviceDefns =
		[
			new DeviceDefn
			(
				"Drive",
				false, // isActive
				false, // needsTarget
				[ "Drive" ], // categoryNames
				function initialize(universe, actor, device) {},
				function updateForTurn(universe, actor, device)
				{
					actor.distancePerMove += 50;
					actor.energyPerMove += 1;
				},
				function use(universe, actor, device, target)
				{
					actor.energyThisTurn -= actor.energyPerMove;
				}
			),
			new DeviceDefn
			(
				"Generator",
				false, // isActive
				false, // needsTarget
				[ "Generator" ], // categoryNames
				function initialize(universe, actor, device) {},
				function updateForTurn(universe, actor, device)
				{
					actor.energyThisTurn += 10;
				},
				function use(universe, actor, device, target)
				{
					// Do nothing.
				}
			),
			new DeviceDefn
			(
				"Shield",
				true, // isActive
				false, // needsTarget
				[ "Shield" ], // categoryNames
				function initialize(universe, actor, device)
				{
					device.isActive = false;
				},
				function updateForTurn(universe, actor, device)
				{
					if (device.isActive)
					{
						actor.energyThisTurn -= 1;
						actor.shieldingThisTurn = 0;
					}
				},
				function use(universe, actor, device, target)
				{
					if (device.isActive)
					{
						device.isActive = false;
						actor.energyThisTurn += 1;
					}
					else
					{
						device.isActive = true;
						actor.energyThisTurn -= 1;
					}
				}
			),
			new DeviceDefn
			(
				"Weapon",
				true, // isActive
				true, // needsTarget
				[ "Weapon" ], // categoryNames
				function initialize(universe, actor, device)
				{
					// todo
				},
				function updateForTurn(universe, actor, device)
				{
					device.usesThisTurn = 3;
				},
				function use(universe, place, actor, device, target)
				{
					if (device.usesThisTurn > 0)
					{
						if (target == null)
						{
							var mustTargetBody = true;
							universe.venueCurrent.cursor.set(actor, "UseDevice", mustTargetBody);
						}
						else // if (target != null)
						{
							device.usesThisTurn--;
							target.integrity -= 1;
							if (target.integrity <= 0)
							{
								alert("todo - ship destroyed");
							}
						}
					}
				}
			),
		];
		var deviceDefnsByName = ArrayHelper.addLookupsByName(deviceDefns);

		for (var i = 0; i < numberOfFactions; i++)
		{
			var factionHomeStarsystem = null;

			var random = Math.random();
			var starsystemIndexStart = Math.floor
			(
				random * numberOfNetworkNodes
			);

			var starsystemIndex = starsystemIndexStart;

			while (factionHomeStarsystem == null)
			{
				factionHomeStarsystem =
					network.nodes[starsystemIndex].starsystem;
				if (factionHomeStarsystem.planets.length == 0)
				{
					factionHomestarsystem = null;
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
			factionHomeStarsystem.factionName = factionName;
			var factionColor = colorsForFactions[i];

			var planets = factionHomeStarsystem.planets;
			var planetIndexRandom = Math.floor(planets.length * Math.random());
			var factionHomePlanet = planets[planetIndexRandom];
			factionHomePlanet.factionName = factionName;

			factionHomePlanet.layout.map.bodies.push
			(
				new Buildable("Hub", new Coords(4, 4), true)
			);

			var factionShips = [];
			var shipDefn = Ship.bodyDefnBuild(factionColor);
			var shipCount = 2;
			for (var s = 0; s < shipCount; s++)
			{
				var ship = new Ship
				(
					factionName + " Ship" + s,
					shipDefn,
					new Coords().randomize().multiply
					(
						factionHomeStarsystem.size
					).multiplyScalar
					(
						2
					).subtract
					(
						factionHomeStarsystem.size
					),
					factionName,
					[
						new Device(deviceDefnsByName.get("Generator") ),
						new Device(deviceDefnsByName.get("Drive") ),
						new Device(deviceDefnsByName.get("Shield") ),
						new Device(deviceDefnsByName.get("Weapon") ),
					]
				);
				ships.push(ship);
				factionShips.push(ship);
				factionHomeStarsystem.ships.push(ship);
			}

			var faction = new Faction
			(
				factionName,
				factionHomeStarsystem.name,
				factionColor,
				[], // relationships
				new TechnologyResearcher
				(
					factionName,
					null, // nameOfTechnologyBeingResearched,
					0, // researchAccumulated
					// namesOfTechnologiesKnown
					[ "A" ]
				),
				[
					factionHomeStarsystem.planets[0]
				],
				factionShips,
				new FactionKnowledge
				(
					[ factionName ],
					[ factionHomeStarsystem.name ],
					factionHomeStarsystem.links(network).map
					(
						x => x.name
					)
				)
			);
			factions.push(faction);
		}

		DiplomaticRelationship.initializeForFactions(factions);

		var camera = new Camera
		(
			viewSize,
			focalLength,
			new Disposition
			(
				new Coords(-viewDimension, 0, 0), //pos,
				new Orientation
				(
					new Coords(1, 0, 0), // forward
					new Coords(0, 0, 1) // down
				)
			)
		);

		var returnValue = new World
		(
			worldName,
			DateTime.now(),
			ActivityDefn.Instances()._All,
			buildableDefns,
			technologyTree,
			network,
			factions,
			ships,
			camera
		);

		return returnValue;
	}

	// instance methods

	activityDefnByName(activityDefnName)
	{
		return this.activityDefnsByName.get(activityDefnName);
	}

	buildableByName(buildableName)
	{
		return this.buildablesByName.get(buildableName);
	}

	factionByName(factionName)
	{
		return this.factionsByName.get(factionName);
	}

	factionCurrent()
	{
		return this.factions[this.factionIndexCurrent];
	}

	factionsOtherThanCurrent()
	{
		var factionCurrent = this.factionCurrent();
		var returnValues = this.factions.slice();
		ArrayHelper.removeAt(returnValues, this.factionIndexCurrent);
		return returnValues;
	}

	initialize(universe)
	{
		if (this.turnsSoFar == 0)
		{
			this.updateForTurn(universe);
		}
	}

	updateForTurn(universe)
	{
		var factionForPlayer = this.factions[0];
		var notifications = factionForPlayer.notificationSession.notifications;
		if (this.turnsSoFar > 0 && notifications.length > 0)
		{
			factionForPlayer.notificationSessionStart(universe);
		}
		else
		{
			this.network.updateForTurn(universe, this);

			for (var i = 0; i < this.factions.length; i++)
			{
				var faction = this.factions[i];
				faction.updateForTurn(universe, this);
			}

			if (this.turnsSoFar > 1 && notifications.length > 0)
			{
				factionForPlayer.notificationSessionStart(universe);
			}

			this.turnsSoFar++;
		}
	}
}
