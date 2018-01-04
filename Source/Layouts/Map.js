
function Map(sizeInPixels, pos, terrains, cellsAsStrings, bodies)
{
	this.sizeInPixels = sizeInPixels;
	this.pos = pos;
	this.terrains = terrains;
	this.cellsAsStrings = cellsAsStrings;
	this.bodies = bodies;

	this.sizeInCells = new Coords
	(
		this.cellsAsStrings[0].length,
		this.cellsAsStrings.length,
		1
	);

	this.sizeInCellsMinusOnes = 
		this.sizeInCells.clone().subtract
		(
			new Coords(1, 1, 1)
		);
	this.cellSizeInPixels = 
		this.sizeInPixels.clone().divide
		(
			this.sizeInCells
		);

	this.cursor = new MapCursor(null, new Coords(0, 0, 0));

	// Helper variables.

	this.drawable = {};
	this.drawable.loc = new Location(new Coords());
}

{
	// instance methods

	Map.prototype.bodyAtCellPosInCells = function(cellPos)
	{
		var returnValue = null;
		for (var i = 0; i < this.bodies.length; i++)
		{
			var body = this.bodies[i];
			var bodyPos = body.loc.pos;
			if (bodyPos.equals(cellPos) == true)
			{
				returnValue = body;
				break;
			}
		}
		return returnValue;
	}

	Map.prototype.terrainAtCellPosInCells = function(cellPos)
	{
		var terrainCode = this.cellsAsStrings[cellPos.y][cellPos.x];
		return this.terrains[terrainCode];
		return returnValue;
	}

	// drawable

	Map.prototype.draw = function(universe, display)
	{
		var world = universe.world;
		var map = this;

		var mapPos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = new Coords(0, 0);
		var drawable = this.drawable;
		var drawPos = drawable.loc.pos;
		var cellSizeInPixels = map.cellSizeInPixels;
		var cellSizeInPixelsHalf = 
			cellSizeInPixels.clone().divideScalar(2);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPos.x = x;

				drawPos.overwriteWith
				(
					cellPos
				).multiply
				(
					cellSizeInPixels
				).add
				(
					mapPos
				);

				var cellTerrain = map.terrainAtCellPosInCells(cellPos);

				var terrainVisual = cellTerrain.visual;
				terrainVisual.draw(universe, world, display, drawable);

				var cellBody = map.bodyAtCellPosInCells(cellPos);
				if (cellBody != null)
				{
					var cellBodyVisual = cellBody.visual(world);
					cellBodyVisual.draw(universe, world, display, drawable);
				}
			}
		}

		var cursor = map.cursor;
		var cursorPos = cursor.pos;
		var cursorIsWithinMap = cursorPos.isInRangeMax
		(
			map.sizeInCellsMinusOnes
		);

		if (cursorIsWithinMap == true)
		{

			var cursorVisual = new VisualRectangle(new Coords(10, 10), null, "Cyan"); // hack

			drawPos.overwriteWith
			(
				cursorPos
			).multiply
			(
				cellSizeInPixels
			).add
			(
				mapPos
			);

			var cellTerrain = this.terrainAtCellPosInCells(cursorPos);
			var terrainName = cellTerrain.name;
			if (terrainName != "None")
			{
				var buildableDefn = cursor.bodyDefn;

				if (buildableDefn != null)
				{
					var bodyVisual = buildableDefn.visual;
					bodyVisual.draw(universe, world, display, drawable);

					var isBuildableAllowedOnTerrain = 
						buildableDefn.terrainNamesAllowed.contains(terrainName);
					if (isBuildableAllowedOnTerrain == false)
					{
						var visualNotAllowed = new VisualText("X", "Red", "White");
						visualNotAllowed.draw(universe, world, display, drawable);
					}
				}

				cursorVisual.draw(universe, world, display, drawable);
			}
		}
	}

}
