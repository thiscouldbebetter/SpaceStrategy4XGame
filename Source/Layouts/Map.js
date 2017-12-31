
function Map(sizeInPixels, sizeInCells, pos, terrains, cells)
{
	this.sizeInPixels = sizeInPixels;
	this.sizeInCells = sizeInCells;
	this.pos = pos;
	this.terrains = terrains;
	this.cells = cells;

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
	// static methods

	Map.fromCellsAsStrings = function
	(
		sizeInPixels, pos, terrains, cellsAsStrings
	)
	{
		var sizeInCells = new Coords
		(
			cellsAsStrings[0].length,
			cellsAsStrings.length,
			1
		);

		var cells = [];

		var cellPos = new Coords(0, 0, 0);

		for (var y = 0; y < sizeInCells.y; y++)
		{
			cellPos.y = y;
			cellRowAsString = cellsAsStrings[y];

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellPos.x = x;
				var cellAsChar = cellRowAsString[x];
				var cellTerrain = terrains[cellAsChar];

				var cell = new MapCell
				(
					cellPos.clone(),
					cellTerrain,
					null // body
				);

				cells.push(cell);
			}
		}

		var returnValue = new Map
		(
			sizeInPixels,
			sizeInCells,
			pos,
			terrains,
			cells
		);

		return returnValue;
	}

	// instance methods

	Map.prototype.cellAtPos = function(cellPos)
	{
		var cellIndex = this.indexOfCellAtPos(cellPos);
		var returnValue = this.cells[cellIndex];
		return returnValue;
	}

	Map.prototype.indexOfCellAtPos = function(cellPos)
	{
		return cellPos.y * this.sizeInCells.x + cellPos.x;
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

				var cell = map.cellAtPos(cellPos);

				var terrainVisual = cell.terrain.visual;
				terrainVisual.draw(universe, world, display, drawable);

				var cellBody = cell.body;
				if (cellBody != null)
				{
					var cellBodyVisual = cellBody.defn.visual;
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

			if (cursor.bodyDefn != null)
			{
				var bodyVisual = cursor.bodyDefn.visual;
				bodyVisual.draw(universe, world, display, drawable);
			}

			cursorVisual.draw(universe, world, display, drawable);
		}
	}

}
