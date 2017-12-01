
function World(name, dateCreated, activityDefns, technologyTree, network, factions, ships, camera)
{
	this.name = name;
	this.dateCreated = dateCreated;

	this.activityDefns = activityDefns.addLookups("name");
	this.technologyTree = technologyTree;
	this.network = network;
	this.factions = factions;
	this.ships = ships;
	this.camera = camera;

	this.dateSaved = this.dateCreated;

	this.factions.addLookups("name");
	this.ships.addLookups("name");

	this.turnsSoFar = 0;
	this.factionIndexCurrent = 0;
}
{
	// static methods

	World.new = function(universe)
	{
		var worldName = NameGenerator.generateName() + " Cluster";

		var technologyTree = TechnologyTree.demo();

		var viewSize = universe.display.sizeInPixels.clone();
		var viewDimension = viewSize.y;

		var networkRadius = viewDimension * .35;
		var numberOfNetworkNodes = 6; // 128;
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

		var colors = Color.Instances;
		var colorsForFactions = 
		[
			colors.Red,
			colors.Orange,
			colors.YellowDark,
			colors.Green,
			colors.Blue,
			colors.Violet,
		];

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

			var ship = new Ship
			(
				factionName + " Ship0",
				Ship.bodyDefnBuild(factionColor),
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
				factionName
			);
			ships.push(ship);
			factionHomeStarsystem.ships.push(ship);

			var faction = new Faction
			(
				factionName,
				factionColor,
				[], // relationships 
				new TechnologyResearcher
				(
					factionName + "_Research",
					null, // nameOfTechnologyBeingResearched,
					0, // researchAccumulated
					// namesOfTechnologiesKnown
					[ "A" ]
				), 
				[
					factionHomeStarsystem.planets[0]
				], 
				[
					ship
				],
				new FactionKnowledge
				(
					[ factionHomeStarsystem ],
					[ factionHomeStarsystem.links() ]
				)
			);
			factions.push(faction);

		}

		DiplomaticRelationship.initializeForFactions(factions);

		var camera = new Camera
		(
			viewSize, 
			focalLength, 
			new Location
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
			technologyTree,
			network,
			factions,
			ships,
			camera
		);
		return returnValue;
	}

	// instance methods

	World.prototype.factionCurrent = function()
	{
		return this.factions[this.factionIndexCurrent];
	}

	World.prototype.factionsOtherThanCurrent = function()
	{
		var factionCurrent = this.factionCurrent();
		var returnValues = this.factions.slice();
		returnValues.splice
		(
			this.factionIndexCurrent, 1
		);
		return returnValues;
	}

	World.prototype.updateForTurn = function()
	{
		this.network.updateForTurn();

		for (var i = 0; i < this.factions.length; i++)
		{
			var faction = this.factions[i];
			faction.updateForTurn();
		}

		this.turnsSoFar++;
	}
}
