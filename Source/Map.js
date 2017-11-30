
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
}
