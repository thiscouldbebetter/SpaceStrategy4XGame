
function Layout(sizeInPixels, map)
{
	this.sizeInPixels = sizeInPixels;
	this.map = map;
}

{
	// static methods

	Layout.planet = function(universe, planet)
	{
		var world = universe.world;
		var viewSize = universe.display.sizeInPixels;
		var mapSizeInPixels = viewSize.clone().multiplyScalar(.5);
		var mapPosInPixels = viewSize.clone().subtract
		(
			mapSizeInPixels
		).divideScalar
		(
			2
		);
		mapPosInPixels.z = 0;

		var mapSizeInCells = new Coords(9, 7);
		var mapCellSizeInPixels = mapSizeInPixels.clone().divide(mapSizeInCells);

		var terrains = 
		[
			new MapTerrain("None", " ", new VisualRectangle(mapCellSizeInPixels, null, "rgba(0, 0, 0, 0)"), false),
			new MapTerrain("Orbit", "-", new VisualRectangle(mapCellSizeInPixels, null, "Violet"), false),
			new MapTerrain("Surface", ".", new VisualRectangle(mapCellSizeInPixels, null, "LightGray"), false),
		];
		terrains.addLookups("codeChar");

		var map = new Map
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

	// turnable

	Layout.prototype.facilities = function()
	{
		return this.map.bodies;
	}

	Layout.prototype.initialize = function(universe)
	{
		// todo
	}

	Layout.prototype.updateForTurn = function(universe, world, faction, parentModel)
	{
		var bodies = this.map.bodies;
		for (var i = 0; i < bodies.length; i++)
		{
			var body = bodies[i];
			if (body.updateForTurn != null)
			{
				cellBody.updateForTurn(universe, world, faction, parentModel, this);
			}
		}

	}

	// drawable

	Layout.prototype.draw = function(universe, display)
	{
		display.drawBackground();
		this.map.draw(universe, display);
	}
}
