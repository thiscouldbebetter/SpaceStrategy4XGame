
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

	this.drawPos = new Coords();
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
		var map = this;
		var graphics = display.graphics;

		var pos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = new Coords(0, 0);
		var drawPos = this.drawPos;
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
					pos
				);

				var cell = map.cellAtPos(cellPos);
				var cellBody = cell.body;

				var colorFill = 
				(
					cellBody == null 
					? "Transparent" 
					: cellBody.defn.color
				);
				var colorBorder = cell.terrain.color;

				graphics.fillStyle = colorFill;
				graphics.fillRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);

				graphics.strokeStyle = colorBorder;
				graphics.strokeRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);

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
			drawPos.overwriteWith
			(
				cursorPos
			).multiply
			(
				cellSizeInPixels
			).add
			(
				pos
			);

			graphics.strokeStyle = "Cyan";

			if (cursor.bodyDefn == null)
			{
				graphics.beginPath();
				graphics.moveTo(drawPos.x, drawPos.y);
				graphics.lineTo
				(
					drawPos.x + cellSizeInPixels.x, 
					drawPos.y + cellSizeInPixels.y
				);
				graphics.moveTo
				(
					drawPos.x + cellSizeInPixels.x, 
					drawPos.y
				);
				graphics.lineTo
				(
					drawPos.x, 
					drawPos.y + cellSizeInPixels.y
				);
				graphics.stroke();
			}
			else
			{
				graphics.fillStyle = cursor.bodyDefn.color;
				graphics.fillRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);
			}

			graphics.strokeRect
			(
				drawPos.x,
				drawPos.y,
				cellSizeInPixels.x,
				cellSizeInPixels.y
			);
		}
	}

}
