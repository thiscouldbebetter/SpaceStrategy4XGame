
class MapLayout
{
	constructor(sizeInPixels, pos, terrains, cellsAsStrings, bodies)
	{
		this.sizeInPixels = sizeInPixels;
		this.pos = pos;
		this.terrains = terrains;
		this.terrainsByCodeChar = ArrayHelper.addLookups
		(
			this.terrains, (x) => x.codeChar
		);

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

		this._cellPos = new Coords();
		this._drawable = {}
		var locatable = new Locatable(null);
		this._drawable.locatable = () => locatable;
		this._neighborOffsets =
		[
			new Coords(1, 0),
			new Coords(0, 1),
			new Coords(-1, 0),
			new Coords(0, -1),
		];
	}

	// instance methods

	bodiesNeighboringCursor()
	{
		return this.bodiesNeighboringPosInCells(this.cursor.pos);
	}

	bodiesNeighboringPosInCells(centerPosInCells)
	{
		var returnValues = [];

		var neighborPos = this._cellPos;

		for (var n = 0; n < this._neighborOffsets.length; n++)
		{
			var neighborOffset = this._neighborOffsets[n];
			neighborPos.overwriteWith(neighborOffset).add(centerPosInCells);
			var bodyAtNeighborPos = this.bodyAtPosInCells(neighborPos);
			if (bodyAtNeighborPos != null)
			{
				returnValues.push(bodyAtNeighborPos);
			}
		}

		return returnValues;
	}

	bodyAtPosInCells(cellPos)
	{
		var returnValue = null;
		for (var i = 0; i < this.bodies.length; i++)
		{
			var body = this.bodies[i];
			var bodyPos = body.locatable().loc.pos;
			if (bodyPos.equals(cellPos))
			{
				returnValue = body;
				break;
			}
		}
		return returnValue;
	}

	bodyAtCursor()
	{
		return this.bodyAtPosInCells(this.cursor.pos);
	}

	terrainAtPosInCells(cellPos)
	{
		var terrainCode = this.cellsAsStrings[cellPos.y][cellPos.x];
		return this.terrainsByCodeChar.get(terrainCode);
		return returnValue;
	}

	terrainAtCursor()
	{
		return this.terrainAtPosInCells(this.cursor.pos);
	}

	// drawable

	draw(universe, display)
	{
		var world = universe.world;
		var map = this;

		var mapPos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = this._cellPos;
		var drawable = this._drawable;
		var drawPos = drawable.locatable().loc.pos;
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

				var cellTerrain = map.terrainAtPosInCells(cellPos);

				var terrainVisual = cellTerrain.visual;
				terrainVisual.draw(universe, world, this, drawable, display);

				var cellBody = map.bodyAtPosInCells(cellPos);
				if (cellBody != null)
				{
					var cellBodyVisual = cellBody.visual(world);
					cellBodyVisual.draw(universe, world, null, drawable, display);
				}
			}
		}

		var cursor = map.cursor;
		var cursorPos = cursor.pos;
		var cursorIsWithinMap = cursorPos.isInRangeMax
		(
			map.sizeInCellsMinusOnes
		);

		if (cursorIsWithinMap)
		{
			var cursorVisual = new VisualRectangle
			(
				new Coords(10, 10), null, Color.byName("Cyan")
			); // hack

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

			var cellTerrain = this.terrainAtCursor();
			var terrainName = cellTerrain.name;
			if (terrainName != "None")
			{
				var buildableDefn = cursor.bodyDefn;

				if (buildableDefn != null)
				{
					var bodyVisual = buildableDefn.visual;
					bodyVisual.draw(universe, world, null, drawable, display);

					var isBuildableAllowedOnTerrain =
						ArrayHelper.contains(buildableDefn.terrainNamesAllowed, terrainName);
					if (isBuildableAllowedOnTerrain == false)
					{
						var visualNotAllowed = VisualText.fromTextAndColor
						(
							"X", Color.byName("Red"),
						);
						visualNotAllowed.draw(universe, world, display, drawable);
					}
				}

				cursorVisual.draw(universe, world, this, drawable, display);
			}
		}
	}
}
