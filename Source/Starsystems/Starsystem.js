
class Starsystem
{
	constructor(name, size, star, linkPortals, planets, factionName)
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
		this.visualElevationStem = new VisualElevationStem();
		var gridColor = Color.Instances().Cyan.clone();
		gridColor.alpha(.5);
		var gridColorSystemColor = gridColor.systemColor();
		this.visualGrid = new VisualGrid(40, 10, gridColorSystemColor);
	}

	// constants

	static SizeStandard()
	{
		if (Starsystem._sizeStandard == null)
		{
			Starsystem._sizeStandard = new Coords(100, 100, 100);
		}
		return Starsystem._sizeStandard;
	}

	// static methods

	static generateRandom(universe)
	{
		var name = NameGenerator.generateName();
		var size = Starsystem.SizeStandard();

		var starRadius = 30;
		var starColor = Color.Instances().Yellow;
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
					VisualText.fromTextAndColor(name, Color.byName("Gray"))
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

	faction(world)
	{
		return (this.factionName == null ? null : world.factionByName(this.factionName));
	}

	links(cluster)
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

	updateForMove()
	{
		alert("todo");
	}

	// turns

	updateForTurn(universe, world)
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

	draw(universe, world, place, entity, display)
	{
		this.visualGrid.draw(universe, world, place, null, display);

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
		var camera = place.camera;

		for (var t = 0; t < bodiesByType.length; t++)
		{
			var bodies = bodiesByType[t];

			for (var i = 0; i < bodies.length; i++)
			{
				var bodyToSort = bodies[i];
				var bodyToSortPos = bodyToSort.locatable().loc.pos;
				camera.coordsTransformWorldToView
				(
					bodyToSortDrawPos.overwriteWith(bodyToSortPos)
				);
				var j = 0;
				for (j = 0; j < bodiesToDrawSorted.length; j++)
				{
					var bodySorted = bodiesToDrawSorted[j];
					camera.coordsTransformWorldToView
					(
						bodySortedDrawPos.overwriteWith(bodySorted.locatable().loc.pos)
					);
					if (bodyToSortDrawPos.z >= bodySortedDrawPos.z)
					{
						break;
					}
				}

				ArrayHelper.insertElementAt(bodiesToDrawSorted, bodyToSort, j);
			}
		}

		for (var i = 0; i < bodiesToDrawSorted.length; i++)
		{
			var body = bodiesToDrawSorted[i];
			this.draw_Body(universe, world, place, body, display);
		}
	}

	draw_Body(universe, world, place, body, display)
	{
		var camera = place.camera;

		var bodyPos = body.locatable().loc.pos;
		this.posSaved.overwriteWith(bodyPos);

		camera.coordsTransformWorldToView(bodyPos);

		var bodyDefn = body.defn;
		var bodyVisual = bodyDefn.visual;
		bodyVisual.draw(universe, world, place, body, display);
		bodyPos.overwriteWith(this.posSaved);

		this.visualElevationStem.draw(universe, world, place, body, display);
	}
}

// Visuals.

class VisualElevationStem
{
	constructor()
	{
		// Helper variables.
		this.drawPosTip = new Coords();
		this.drawPosPlane = new Coords();
	}

	draw(universe, world, place, entity, display)
	{
		var camera = place.camera;
		var drawablePosWorld = entity.locatable().loc.pos;
		var drawPosTip = camera.coordsTransformWorldToView
		(
			this.drawPosTip.overwriteWith(drawablePosWorld)
		);
		var drawPosPlane = camera.coordsTransformWorldToView
		(
			this.drawPosPlane.overwriteWith(drawablePosWorld).clearZ()
		);
		var colorName = (drawablePosWorld.z < 0 ? "Green" : "Red");
		display.drawLine(drawPosTip, drawPosPlane, Color.byName(colorName).systemColor());
	}
}

class VisualGrid
{
	constructor(gridDimensionInCells, gridCellDimensionInPixels, color)
	{
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
		this.multiplierTimesI = new Coords();
	}

	draw(universe, world, place, entity, display)
	{
		var camera = place.camera;

		var drawPosFrom = this.drawPosFrom;
		var drawPosTo = this.drawPosTo;
		var multiplier = this.multiplier;
		var multiplierTimesI = this.multiplierTimesI;

		for (var d = 0; d < 2; d++)
		{
			multiplier.clear();
			multiplier.dimensionSet
			(
				d, this.gridCellSizeInPixels.dimensionGet(d)
			);
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

				drawPosFrom.dimensionSet(d, 0);
				drawPosTo.dimensionSet(d, 0);

				multiplierTimesI.overwriteWith(multiplier).multiplyScalar(i)
				drawPosFrom.add(multiplierTimesI);
				drawPosTo.add(multiplierTimesI);

				camera.coordsTransformWorldToView(drawPosFrom);
				camera.coordsTransformWorldToView(drawPosTo);

				if (drawPosFrom.z >= 0 && drawPosTo.z >= 0)
				{
					// todo - Real clipping.
					display.drawLine(drawPosFrom, drawPosTo, this.color);
				}
			}
		}
	}
}
