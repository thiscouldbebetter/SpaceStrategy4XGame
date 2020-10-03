
function World(name, dateCreated, activityDefns, buildables, technologyTree, network, factions, ships, camera)
{
	this.name = name;
	this.dateCreated = dateCreated;

	this.activityDefns = activityDefns.addLookupsByName();
	this.buildables = buildables.addLookupsByName();
	this.technologyTree = technologyTree;
	this.network = network;
	this.factions = factions;
	this.ships = ships;
	this.camera = camera;

	this.dateSaved = this.dateCreated;

	this.factions.addLookupsByName();
	this.ships.addLookupsByName();

	this.turnsSoFar = 0;
	this.factionIndexCurrent = 0;
}
{
	// static methods

	World.create = function(universe)
	{
		var worldName = NameGenerator.generateName() + " Cluster";

		var mapCellSizeInPixels = new Coords(20, 20); // hack

		var terrainNamesOrbit = [ "Orbit" ];
		var terrainNamesSurface = [ "Surface" ];

		var buildables =
		[
			new BuildableDefn
			(
				"Hub",
				terrainNamesSurface,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, Color.byName("Gray")),
					new VisualText
					(
						new DataBinding(null, (c) => "H", null),
						null, // heightInPixels
						Color.byName("White"),
						Color.byName("Gray"),
						null
					)
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
					new VisualText
					(
						new DataBinding(null, (c) => "F", null),
						null, // heightInPixels
						Color.byName("White"),
						Color.byName("Gray"),
						null
					)
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
					new VisualText
					(
						new DataBinding(null, (c) => "L", null),
						null, // heightInPixels
						Color.byName("White"),
						Color.byName("Gray"),
						null
					)

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
					new VisualText
					(
						new DataBinding(null, (c) => "P", null),
						null, // heightInPixels
						Color.byName("White"),
						Color.byName("Gray"),
						null
					)

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
					new VisualText("Ship", "White", "Gray")
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
		].addLookupsByName();

		var technologyTree = TechnologyTree.demo();

		var viewSize = universe.display.sizeInPixels.clone();
		var viewDimension = viewSize.y;

		var networkRadius = viewDimension * .25;
		var numberOfNetworkNodes = 12;
		var network = Network.generateRandom
		(
			universe,
			worldName,
			NetworkNodeDefn.Instances._All,
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
					if (device.isActive == true)
					{
						actor.energyThisTurn -= 1;
						actor.shieldingThisTurn = 0;
					}
				},
				function use(universe, actor, device, target)
				{
					if (device.isActive == true)
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
		].addLookupsByName();

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
				factionHomeStarsystem = network.nodes[starsystemIndex].starsystem;
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
						new Device(deviceDefns["Generator"]),
						new Device(deviceDefns["Drive"]),
						new Device(deviceDefns["Shield"]),
						new Device(deviceDefns["Weapon"]),
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
			ActivityDefn.Instances._All,
			buildables,
			technologyTree,
			network,
			factions,
			ships,
			camera
		);

		return returnValue;
	};

	// instance methods

	World.prototype.factionCurrent = function()
	{
		return this.factions[this.factionIndexCurrent];
	};

	World.prototype.factionsOtherThanCurrent = function()
	{
		var factionCurrent = this.factionCurrent();
		var returnValues = this.factions.slice();
		returnValues.removeAt(this.factionIndexCurrent);
		return returnValues;
	};

	World.prototype.initialize = function(universe)
	{
		if (this.turnsSoFar == 0)
		{
			this.updateForTurn(universe);
		}
	};

	World.prototype.updateForTurn = function(universe)
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
	};
}
