
class Layout
{
	sizeInPixels: Coords;
	map: MapLayout;

	constructor(sizeInPixels: Coords, map: MapLayout)
	{
		this.sizeInPixels = sizeInPixels;
		this.map = map;
	}

	// static methods

	static planet(universe: Universe, planet: Planet): Layout
	{
		var viewSize = universe.display.sizeInPixels;
		var mapSizeInPixels = viewSize.clone().half();
		var mapPosInPixels = viewSize.clone().subtract
		(
			mapSizeInPixels
		).divideScalar
		(
			2
		);
		mapPosInPixels.z = 0;

		var mapSizeInCells = Coords.fromXY(9, 7);
		var mapCellSizeInPixels = mapSizeInPixels.clone().divide(mapSizeInCells);

		var terrains =
		[
			new MapTerrain
			(
				"None",
				" ",
				new VisualRectangle(mapCellSizeInPixels, null, Color.byName("_Transparent"), null),
				false
			),
			new MapTerrain
			(
				"Orbit",
				"-",
				new VisualRectangle(mapCellSizeInPixels, null, Color.byName("Violet"), null),
				false
			),
			new MapTerrain
			(
				"Surface",
				".",
				new VisualRectangle(mapCellSizeInPixels, null, Color.byName("GrayLight"), null),
				false
			),
		];

		var map = new MapLayout
		(
			mapSizeInPixels,
			mapPosInPixels,
			terrains,
			// cellsAsStrings
			[
				"---------",
				"         ",
				".........",
				".........",
				".........",
				".........",
				".........",
			],
			[] // bodies
		);

		var layout = new Layout
		(
			viewSize.clone(), // sizeInPixels
			map
		);

		return layout;
	}

	// instance methods

	buildableEntitiesRemove(buildableEntitiesToRemove: Entity[]): void
	{
		buildableEntitiesToRemove.forEach(x => this.buildableEntityRemove(x));
	}

	buildableEntityBuild(buildableEntityToBuild: Entity): void
	{
		var buildableEntityInProgress = this.buildableEntityInProgress();
		if (buildableEntityInProgress != null)
		{
			if (buildableEntityInProgress != buildableEntityToBuild)
			{
				this.buildableEntityRemove(buildableEntityInProgress);
			}
		}

		var buildables = this.map.bodies;
		buildables.push(buildableEntityToBuild);
	}

	buildableEntityInProgress(): Entity
	{
		return this.map.bodies.find
		(
			x => Buildable.fromEntity(x).isComplete == false
		);
	}

	buildableEntityRemove(buildableEntityToRemove: Entity): void
	{
		var bodies = this.map.bodies;
		bodies.splice
		(
			bodies.indexOf(buildableEntityToRemove), 1
		);
	}

	// turnable

	facilities(): Entity[]
	{
		return this.map.bodies;
	}

	initialize(universe: Universe): void
	{
		// todo
	}

	updateForTurn(universe: Universe, world: World, faction: Faction, parentModel: Entity): void
	{
		// todo
	}

	// drawable

	draw(universe: Universe, display: Display): void
	{
		display.drawBackground(null, null);

		this.map.draw(universe, display);
	}
}
