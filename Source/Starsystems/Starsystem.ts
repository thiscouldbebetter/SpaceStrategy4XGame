
class Starsystem
{
	name: string;
	size: Coords;
	star: Planet;
	linkPortals: LinkPortal[];
	linkPortalsByStarsystemSourceName: Map<string,LinkPortal>;
	planets: Planet[];
	factionName: string;

	ships: Ship[];

	posSaved: Coords;
	visualElevationStem: VisualElevationStem;
	visualGrid: VisualGrid;

	constructor
	(
		name: string,
		size: Coords,
		star: Planet,
		linkPortals: LinkPortal[],
		planets: Planet[],
		factionName: string
	)
	{
		this.name = name;
		this.size = size;

		this.star = star;
		this.linkPortals = linkPortals;
		this.planets = planets;
		this.factionName = factionName;

		this.linkPortalsByStarsystemSourceName = ArrayHelper.addLookups
		(
			this.linkPortals,
			x => x.starsystemNamesFromAndTo[0]
		);
		this.ships = new Array<Ship>();

		// Helper variables
		this.posSaved = Coords.create();
		this.visualElevationStem = new VisualElevationStem();
		var gridColor = Color.Instances().Cyan.clone();
		gridColor.alpha(.5);
		this.visualGrid = new VisualGrid(40, 10, gridColor);
	}

	// constants

	static _sizeStandard: Coords;
	static SizeStandard()
	{
		if (Starsystem._sizeStandard == null)
		{
			Starsystem._sizeStandard = new Coords(100, 100, 100);
		}
		return Starsystem._sizeStandard;
	}

	// static methods

	static generateRandom(universe: Universe)
	{
		var name = NameGenerator.generateName();
		var size = Starsystem.SizeStandard();

		var star = Planet.fromNameBodyDefnAndPos
		(
			this.name, Planet.bodyDefnStar(), new Coords(0, 0, -10)
		);

		var numberOfPlanetsMin = 1;
		var numberOfPlanetsMax = 4;
		var numberOfPlanetsRange =
			numberOfPlanetsMax - numberOfPlanetsMin;
		var numberOfPlanets = numberOfPlanetsMin + Math.floor
		(
			Math.random() * numberOfPlanetsRange
		);
		var bodyDefnPlanet = Planet.bodyDefnPlanet();

		var planets = new Array<Planet>();
		for (var i = 0; i < numberOfPlanets; i++)
		{
			var planetName = name + " " + (i + 1);

			var planet = new Planet
			(
				planetName,
				bodyDefnPlanet,
				// pos
				Coords.create().randomize(universe.randomizer).multiply
				(
					size
				).multiplyScalar
				(
					2
				).subtract
				(
					size
				),
				null, // factionName
				new PlanetDemographics(0),
				new PlanetIndustry(), // 0, null),
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
			planets,
			null // factionName
		);

		return returnValue;
	}

	// instance methods

	faction(world: WorldExtended)
	{
		return (this.factionName == null ? null : world.factionByName(this.factionName));
	}

	linkPortalAdd(linkPortalToAdd: LinkPortal)
	{
		this.linkPortals.push(linkPortalToAdd);
	}

	linkPortalByStarsystemSourceName(starsystemSourceName: string)
	{
		return this.linkPortalsByStarsystemSourceName.get(starsystemSourceName);
	}

	links(cluster: Network2)
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

	shipAdd(shipToAdd: Ship)
	{
		this.ships.push(shipToAdd);
	}

	shipRemove(shipToRemove: Ship)
	{
		ArrayHelper.remove(this.ships, shipToRemove);
	}

	// moves

	updateForMove()
	{
		alert("todo");
	}

	// turns

	updateForTurn(universe: Universe, world: WorldExtended)
	{
		for (var i = 0; i < this.planets.length; i++)
		{
			var planet = this.planets[i];
			planet.updateForTurn(universe, world, planet.faction(world));
		}

		for (var i = 0; i < this.ships.length; i++)
		{
			var ship = this.ships[i];
			ship.updateForTurn(universe, world, ship.faction(world));
		}

	}

	// drawing

	camera(universe: Universe)
	{
		// hack - Get a camera, without a Place.
		var venue = universe.venueCurrent;
		var venueTypeName = venue.constructor.name;
		if (venueTypeName == VenueFader.name)
		{
			var venueAsVenueFader = venue as VenueFader;
			venue = venueAsVenueFader.venueCurrent();
		}
		var venueAsVenueStarsystem = venue as VenueStarsystem;
		var camera = venueAsVenueStarsystem.cameraEntity.camera();
		return camera;
	}

	draw
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		display: Display
	)
	{
		var camera = this.camera(universe);

		this.visualGrid.draw(universe, world, place, null, display);

		var bodiesByType =
		[
			[ this.star ],
			this.linkPortals,
			this.planets,
			this.ships,
		];

		var bodyToSortDrawPos = Coords.create();
		var bodySortedDrawPos = Coords.create();
		var bodiesToDrawSorted = new Array<Entity>();

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

				ArrayHelper.insertElementAt
				(
					bodiesToDrawSorted, bodyToSort, j
				);
			}
		}

		for (var i = 0; i < bodiesToDrawSorted.length; i++)
		{
			var body = bodiesToDrawSorted[i];
			this.draw_Body(universe, world, place, body, display);
		}
	}

	draw_Body
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		display: Display
	)
	{
		var bodyPos = entity.locatable().loc.pos;
		this.posSaved.overwriteWith(bodyPos);

		var camera = this.camera(universe);
		camera.coordsTransformWorldToView(bodyPos);

		var bodyDefn = BodyDefn.fromEntity(entity);
		var bodyVisual = bodyDefn.visual;
		bodyVisual.draw(universe, world, place, entity, display);
		bodyPos.overwriteWith(this.posSaved);

		this.visualElevationStem.draw(universe, world, place, entity, display);
	}
}

// Visuals.

class VisualElevationStem
{
	drawPosTip: Coords;
	drawPosPlane: Coords;

	constructor()
	{
		// Helper variables.
		this.drawPosTip = Coords.create();
		this.drawPosPlane = Coords.create();
	}

	draw
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		display: Display
	)
	{
		var starsystem = (universe.venueCurrent as VenueStarsystem).starsystem;
		if (starsystem == null)
		{
			return;
		}
		var camera = starsystem.camera(universe);

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
		display.drawLine
		(
			drawPosTip, drawPosPlane, Color.byName(colorName), null
		);
	}
}

class VisualGrid
{
	gridSizeInCells: Coords;
	gridCellSizeInPixels: Coords;
	color: Color;

	gridSizeInPixels: Coords;
	gridSizeInCellsHalf: Coords;
	gridSizeInPixelsHalf: Coords;

	displacement: Coords;
	drawPosFrom: Coords;
	drawPosTo: Coords;
	multiplier: Coords;
	multiplierTimesI: Coords;

	constructor
	(
		gridDimensionInCells: number,
		gridCellDimensionInPixels: number,
		color: Color
	)
	{
		this.gridSizeInCells =
			Coords.fromXY(1, 1).multiplyScalar(gridDimensionInCells);
		this.gridCellSizeInPixels =
			Coords.fromXY(1, 1).multiplyScalar(gridCellDimensionInPixels);
		this.color = color;

		this.gridSizeInPixels =
			this.gridSizeInCells.clone().multiply(this.gridCellSizeInPixels);
		this.gridSizeInCellsHalf = this.gridSizeInCells.clone().half();
		this.gridSizeInPixelsHalf = this.gridSizeInPixels.clone().half();

		// Helper variables.
		this.displacement = Coords.create();
		this.drawPosFrom = Coords.create();
		this.drawPosTo = Coords.create();
		this.multiplier = Coords.create();
		this.multiplierTimesI = Coords.create();
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var starsystem = (universe.venueCurrent as VenueStarsystem).starsystem;
		if (starsystem == null)
		{
			return;
		}
		var camera = starsystem.camera(universe);

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
					display.drawLine
					(
						drawPosFrom, drawPosTo, this.color, null
					);
				}
			}
		}
	}
}
