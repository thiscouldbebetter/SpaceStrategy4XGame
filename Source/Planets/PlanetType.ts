
class PlanetType
{
	size: PlanetSize;
	environment: PlanetEnvironment;

	constructor(size: PlanetSize, environment: PlanetEnvironment)
	{
		this.size = size;
		this.environment = environment;
	}

	static byName(name: string): PlanetType
	{
		return PlanetType.Instances().byName(name);
	}

	static random(): PlanetType
	{
		return PlanetType.Instances().random();
	}

	static _instances: PlanetType_Instances;
	static Instances(): PlanetType_Instances
	{
		if (PlanetType._instances == null)
		{
			PlanetType._instances = new PlanetType_Instances();
		}
		return PlanetType._instances;
	}

	private _bodyDefn: BodyDefn;
	bodyDefn(): BodyDefn
	{
		if (this._bodyDefn == null)
		{
			var planetDimension = this.size.radiusInPixels;

			var size = Coords.fromXY(1, 1).multiplyScalar(planetDimension);

			var colors = Color.Instances();
			var colorAtCenter = this.environment.color; // White;
			var colorMiddle = colorAtCenter;
			var colorSpace = colors.Black;

			var visualForPlanetType = new VisualCircleGradient
			(
				planetDimension, // radius
				new ValueBreakGroup
				(
					[
						new ValueBreak(0, colorAtCenter),
						new ValueBreak(.2, colorAtCenter),
						new ValueBreak(.3, colorMiddle),
						new ValueBreak(.75, colorMiddle),
						new ValueBreak(1, colorSpace),
					],
					null // ?
				),
				null // colorBorder
			);

			var visualLabel = new VisualDynamic // todo - VisualDynamic2?
			(
				(uwpe: UniverseWorldPlaceEntities) =>
				{
					var planet = uwpe.entity as Planet;
					var factionName = planet.factionable().factionName; // todo
					var returnValue: VisualBase = null;
					if (factionName == null)
					{
						returnValue = new VisualNone();
					}
					else
					{
						returnValue = new VisualOffset
						(
							Coords.fromXY(0, 16),
							VisualText.fromTextHeightAndColor
							(
								factionName, planetDimension, Color.byName("White"),
							)
						)
					}
					return returnValue;
				}
			);

			var visual = new VisualGroup
			([
				visualForPlanetType,
				visualLabel
			]);

			this._bodyDefn = new BodyDefn
			(
				this.name(),
				size,
				visual
			);
		}

		return this._bodyDefn;
	}

	layoutCreate(universe: Universe): Layout
	{
		var viewSize = universe.display.sizeInPixels;

		var mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0);
		var mapSizeInCells = this.size.surfaceSizeInCells;
		var mapSizeInPixels = mapSizeInCells.clone().multiply(mapCellSizeInPixels);

		var mapPosInPixels = viewSize.clone().subtract
		(
			mapSizeInPixels
		).divideScalar
		(
			2
		).add
		(
			mapCellSizeInPixels.clone().half()
		);
		mapPosInPixels.z = 0;


		var terrains = MapTerrain.planet(mapCellSizeInPixels);

		var cellRowsAsStrings = new Array<string>();

		var terrainSurface = terrains.find(x => x.name == "Surface");

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			var terrain = terrainSurface; // todo
			var cellRowAsString = "".padStart(mapSizeInCells.x, terrain.codeChar);
			cellRowsAsStrings.push(cellRowAsString);
		}

		var map = new MapLayout
		(
			mapSizeInPixels, // mapSizeInPixels
			mapPosInPixels,
			terrains,
			cellRowsAsStrings,
			[] // bodies
		);

		var layout = new Layout
		(
			viewSize.clone(), // sizeInPixels
			map
		);

		return layout;
	}

	name(): string
	{
		return this.size.name + " " + this.environment.name;
	}
}

class PlanetType_Instances
{
	// Default: PlanetType;

	_All: PlanetType[];

	constructor()
	{
		var pt = (size: PlanetSize, environment: PlanetEnvironment) =>
			new PlanetType(size, environment);

		var sizes = PlanetSize.Instances()._All;
		var environments = PlanetEnvironment.Instances()._All;

		var planetTypes = [];

		for (var s = 0; s < sizes.length; s++)
		{
			var size = sizes[s];

			for (var e = 0; e < environments.length; e++)
			{
				var environment = environments[e];

				var planetType = pt(size, environment);

				planetTypes.push(planetType);
			}
		}

		this._All = planetTypes;
	}

	byName(name: string): PlanetType
	{
		return this._All.find(x => x.name() == name);
	}

	random(): PlanetType
	{
		var indexRandom = Math.floor(Math.random() * this._All.length);
		var planetTypeRandom = this._All[indexRandom];
		return planetTypeRandom;
	}
}