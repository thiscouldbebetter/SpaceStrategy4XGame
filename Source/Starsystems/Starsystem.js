
function Starsystem(name, size, star, linkPortals, planets, factionName)
{
	this.name = name;
	this.size = size;

	this.star = star;
	this.linkPortals = linkPortals;
	this.planets = planets;
	this.factionName = factionName;

	this.ships = [];

	// Helper variables
	this.posSaved = new Coords();
	this.visualElevationStem = new VisualElevationStem(null);
	this.visualGrid = new VisualGrid(null, 40, 10, Color.Instances().CyanHalfTranslucent.systemColor);
}

{
	// constants

	Starsystem.SizeStandard = new Coords(100, 100, 100);

	// static methods

	Starsystem.generateRandom = function(universe)
	{
		var name = NameGenerator.generateName();
		var size = Starsystem.SizeStandard;

		var starRadius = 30;
		var starColor = Color.Instances().Yellow.systemColor;
		var star = new Body
		(
			"Star", 
			new BodyDefn
			(
				"Star", 
				new Coords(1, 1).multiplyScalar(starRadius), // size
				new VisualGroup
				([
					new VisualCircle(starRadius, starColor, starColor),
					new VisualText(name, "Gray"),
				])
			),
			new Coords(0, 0, -10)
		);

		var numberOfPlanetsMin = 1;
		var numberOfPlanetsMax = 4;
		var numberOfPlanetsRange = 
			numberOfPlanetsMax - numberOfPlanetsMin;
		var numberOfPlanets = numberOfPlanetsMin + Math.floor
		(
			Math.random() * numberOfPlanetsRange
		);

		var spaceBetweenPlanets = 40;

		var planets = [];
		for (var i = 0; i < numberOfPlanets; i++)
		{
			var planetName = name + " " + (i + 1);

			var planet = new Planet
			(
				planetName,
				null, // factionName
				// pos
				new Coords().randomize().multiply
				(
					size
				).multiplyScalar
				(
					2
				).subtract
				(
					size
				),
				new PlanetDemographics(0),
				new PlanetIndustry(0, null),
				null // layout
			);

			planet.layout = Layout.planet(universe, planet);

			planets.push(planet);
		}

		var returnValue = new Starsystem
		(
			name,
			size,
			star,
			[], // linkPortals - generated later
			planets
		);

		return returnValue;
	}

	// instance methods

	Starsystem.prototype.faction = function(world)
	{
		return (this.factionName == null ? null : world.factions[this.factionName]);
	}

	Starsystem.prototype.links = function(cluster)
	{
		var returnValues = [];

		for (var i = 0; i < this.linkPortals.length; i++)
		{
			var linkPortal = this.linkPortals[i];
			var link = linkPortal.link(cluster);
			returnValues.push(link);
		}

		return returnValues;
	}

	// moves

	Starsystem.prototype.updateForMove = function()
	{
		alert("todo");
	}

	// turns

	Starsystem.prototype.updateForTurn = function(universe, world)
	{
		for (var i = 0; i < this.bodies.length; i++)
		{
			var body = this.bodies[i];
			if (body.updateForTurn != null)
			{
				body.updateForTurn(universe, world, this);
			}
		}
	}

	// drawing

	Starsystem.prototype.draw = function(universe, world, display, camera)
	{
		this.visualElevationStem.camera = camera;
		this.visualGrid.camera = camera;

		this.visualGrid.draw(universe, display);

		var bodiesByType =
		[
			[ this.star ],
			this.linkPortals,
			this.planets,
			this.ships,
		];

		var bodyToSortDrawPos = new Coords();
		var bodySortedDrawPos = new Coords();
		var bodiesToDrawSorted = [];

		for (var t = 0; t < bodiesByType.length; t++)
		{
			var bodies = bodiesByType[t];

			for (var i = 0; i < bodies.length; i++)
			{
				var bodyToSort = bodies[i];
				camera.coordsTransformWorldToView
				(
					bodyToSortDrawPos.overwriteWith(bodyToSort.loc.pos)
				);
				var j = 0;
				for (j = 0; j < bodiesToDrawSorted.length; j++)
				{
					var bodySorted = bodiesToDrawSorted[j];
					camera.coordsTransformWorldToView
					(
						bodySortedDrawPos.overwriteWith(bodySorted.loc.pos)
					);
					if (bodyToSortDrawPos.z >= bodySortedDrawPos.z)
					{
						break;
					}
				}

				bodiesToDrawSorted.insertElementAt(bodyToSort, j);
			}
		}

		for (var i = 0; i < bodiesToDrawSorted.length; i++)
		{
			var body = bodiesToDrawSorted[i];
			this.draw_Body(universe, world, display, camera, body);
		}
	}

	Starsystem.prototype.draw_Body = function(universe, world, display, camera, body)
	{
		var bodyPos = body.loc.pos;
		this.posSaved.overwriteWith(bodyPos);

		camera.coordsTransformWorldToView(bodyPos);

		var bodyDefn = body.defn;
		var bodyVisual = bodyDefn.visual;
		bodyVisual.draw(universe, world, display, body);
		bodyPos.overwriteWith(this.posSaved);

		this.visualElevationStem.draw(universe, world, display, body);
	}
}

// Visuals.

function VisualElevationStem(camera)
{
	this.camera = camera;
	this.drawPosTip = new Coords();
	this.drawPosPlane = new Coords();
}
{
	VisualElevationStem.prototype.draw = function(universe, world, display, drawable)
	{
		var drawablePosWorld = drawable.loc.pos;
		var drawPosTip = this.camera.coordsTransformWorldToView
		(
			this.drawPosTip.overwriteWith(drawablePosWorld)
		);
		var drawPosPlane = this.camera.coordsTransformWorldToView
		(
			this.drawPosPlane.overwriteWith(drawablePosWorld).clearZ()
		);
		var colorName = (drawablePosWorld.z < 0 ? "Green" : "Red");
		var colors = Color.Instances();
		display.drawLine(drawPosTip, drawPosPlane, colors[colorName].systemColor);
	}
}

function VisualGrid(camera, gridDimensionInCells, gridCellDimensionInPixels, color)
{
	this.camera = camera;
	this.gridSizeInCells = new Coords(1, 1, 0).multiplyScalar(gridDimensionInCells);
	this.gridCellSizeInPixels = new Coords(1, 1, 0).multiplyScalar(gridCellDimensionInPixels);
	this.color = color;

	this.gridSizeInPixels = this.gridSizeInCells.clone().multiply(this.gridCellSizeInPixels);
	this.gridSizeInCellsHalf = this.gridSizeInCells.clone().half();
	this.gridSizeInPixelsHalf = this.gridSizeInPixels.clone().half();

	// Helper variables.
	this.displacement = new Coords();
	this.drawPosFrom = new Coords();
	this.drawPosTo = new Coords();
	this.multiplier = new Coords();
}
{
	VisualGrid.prototype.draw = function(universe, display, drawable, drawLoc)
	{
		var drawPosFrom = this.drawPosFrom;
		var drawPosTo = this.drawPosTo;
		var multiplier = this.multiplier;

		for (var d = 0; d < 2; d++)
		{
			multiplier.clear();
			multiplier.dimension(d, this.gridCellSizeInPixels.dimension(d));

			for (var i = 0 - this.gridSizeInCellsHalf.x; i <= this.gridSizeInCellsHalf.x; i++)
			{
				drawPosFrom.overwriteWith
				(
					this.gridSizeInPixelsHalf
				).multiplyScalar(-1);

				drawPosTo.overwriteWith
				(
					this.gridSizeInPixelsHalf
				);

				drawPosFrom.dimension(d, 0);
				drawPosTo.dimension(d, 0);

				drawPosFrom.add(multiplier.clone().multiplyScalar(i));
				drawPosTo.add(multiplier.clone().multiplyScalar(i));

				this.camera.coordsTransformWorldToView(drawPosFrom);
				this.camera.coordsTransformWorldToView(drawPosTo);

				if (drawPosFrom.z >= 0 && drawPosTo.z >= 0)
				{
					// todo - Real clipping.
					display.drawLine(drawPosFrom, drawPosTo, this.color);
				}

			}
		}
	}
}
