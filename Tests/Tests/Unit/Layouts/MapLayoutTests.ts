
class MapLayoutTests extends TestFixture
{
	constructor()
	{
		super(MapLayoutTests.name);
	}

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.bodiesNeighboringCursor,
			this.bodiesNeighboringPosInCells,
			this.bodyAtPosInCells,
			this.bodyAtCursor,
			this.terrainAtPosInCells,
			this.terrainAtCursor,

			this.draw
		];

		return returnValues;
	}

	// Setup.

	mapLayoutBuild(): MapLayout
	{
		var visual = new VisualNone();

		var terrain = new MapTerrain
		(
			"Surface",
			".",
			visual,
			false // ?
		);
		var terrains = [ terrain ];

		var cellsAsStrings =
		[
			"........",
			"........",
			"........",
			"........"
		];

		var drawable = Drawable.fromVisual(visual);

		var entities =
		[
			new Entity
			(
				"[name]",
				[
					drawable,
					Locatable.fromPos(Coords.zeroes())
				]
			),
			new Entity
			(
				"[name2]",
				[
					drawable,
					Locatable.fromPos(Coords.ones())
				]
			),
			new Entity
			(
				"[name3]",
				[
					drawable,
					Locatable.fromPos(Coords.twos())
				]
			),
		];

		var returnValue = new MapLayout
		(
			Coords.fromXY(100, 100), // sizeInPixels
			Coords.zeroes(), // pos
			terrains,
			cellsAsStrings,
			entities
		);

		return returnValue;
	}

	universeBuild(): Universe
	{
		return new EnvironmentMock().universeBuild();
	}

	// Tests.

	// instance methods

	bodiesNeighboringCursor(): void
	{
		var map = this.mapLayoutBuild();
		var entities = map.bodiesNeighboringCursor();
		Assert.isNotNull(entities);
	}

	bodiesNeighboringPosInCells(): void
	{
		var map = this.mapLayoutBuild();
		var centerPosInCells = Coords.zeroes();
		var entities = map.bodiesNeighboringPosInCells(centerPosInCells);
		Assert.isNotNull(entities);
	}

	bodyAtPosInCells(): void
	{
		var map = this.mapLayoutBuild();
		var posInCells = Coords.zeroes();
		var entityAtPos = map.bodyAtPosInCells(posInCells);
		Assert.isNotNull(entityAtPos);
	}

	bodyAtCursor(): void 
	{
		var map = this.mapLayoutBuild();
		var entityAtCursor = map.bodyAtCursor();
		Assert.isNotNull(entityAtCursor);
	}

	terrainAtPosInCells(): void
	{
		var map = this.mapLayoutBuild();
		var posInCells = Coords.zeroes();
		var terrain = map.terrainAtPosInCells(posInCells);
		Assert.isNotNull(terrain);
	}

	terrainAtCursor(): void
	{
		var map = this.mapLayoutBuild();
		var terrain = map.terrainAtCursor();
		Assert.isNotNull(terrain);
	}

	// drawable

	draw(): void
	{
		var universe = this.universeBuild();
		var map = this.mapLayoutBuild();
		map.draw(universe, universe.display);
	}
}
