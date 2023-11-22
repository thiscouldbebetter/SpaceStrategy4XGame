
class MapLayout
{
	sizeInPixels: Coords;
	pos: Coords;
	terrains: MapTerrain[];
	cellsAsStrings: string[];
	private _bodies: Entity[];

	cellSizeInPixels: Coords;
	cellSizeInPixelsHalf: Coords;
	sizeInCells: Coords;
	sizeInCellsMinusOnes: Coords;
	cursor: MapCursor;

	_cellPos: Coords;
	_drawable: any;
	_neighborOffsets: Coords[];
	terrainsByCodeChar: Map<string, MapTerrain>;
	terrainsByName: Map<string, MapTerrain>;

	constructor
	(
		sizeInPixels: Coords,
		pos: Coords,
		terrains: MapTerrain[],
		cellsAsStrings: string[],
		bodies: Entity[]
	)
	{
		this.sizeInPixels = sizeInPixels;
		this.pos = pos;
		this.terrains = terrains;
		this.terrainsByCodeChar = ArrayHelper.addLookups
		(
			this.terrains, (x) => x.codeChar
		);
		this.terrainsByName = ArrayHelper.addLookupsByName(this.terrains);

		this.cellsAsStrings = cellsAsStrings;
		this._bodies = bodies;

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

		this.cursor = new MapCursor(null, Coords.zeroes());

		// Helper variables.

		this._cellPos = Coords.zeroes();
		var drawableLocatable = new Locatable(null);
		this._drawable = new Entity("[drawable]", [ drawableLocatable ]);
		this._neighborOffsets =
		[
			Coords.fromXY(1, 0),
			Coords.fromXY(0, 1),
			Coords.fromXY(-1, 0),
			Coords.fromXY(0, -1),
		];
	}

	// instance methods

	bodies(): Entity[]
	{
		return this._bodies;
	}

	bodiesNeighboringCursor(): Entity[]
	{
		return this.bodiesNeighboringPosInCells(this.cursor.pos);
	}

	bodiesNeighboringPosInCells(centerPosInCells: Coords): Entity[]
	{
		var returnValues = new Array<Entity>();

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

	bodyAdd(bodyToAdd: Entity): void
	{
		this._bodies.push(bodyToAdd);
	}

	bodyAtPosInCells(cellPos: Coords): Entity
	{
		var returnValue = null;
		var bodies = this.bodies();
		for (var i = 0; i < bodies.length; i++)
		{
			var body = bodies[i];
			var bodyPos = body.locatable().loc.pos;
			if (bodyPos.equals(cellPos))
			{
				returnValue = body;
				break;
			}
		}
		return returnValue;
	}

	bodyAtCursor(): Entity
	{
		return this.bodyAtPosInCells(this.cursor.pos);
	}

	bodyRemove(bodyToRemove: Entity): void
	{
		this._bodies.splice
		(
			this._bodies.indexOf(bodyToRemove), 1
		);
	}
	terrainAtPosInCells(cellPos: Coords): MapTerrain
	{
		var terrainCode = this.cellsAsStrings[cellPos.y][cellPos.x];
		var returnValue = this.terrainByCode(terrainCode);
		return returnValue;
	}

	terrainAtCursor(): MapTerrain
	{
		return this.terrainAtPosInCells(this.cursor.pos);
	}

	terrainByCode(terrainCode: string): MapTerrain
	{
		return this.terrainsByCodeChar.get(terrainCode);
	}

	terrainByName(terrainName: string): MapTerrain
	{
		return this.terrainsByName.get(terrainName);
	}

	// drawable

	draw(universe: Universe, display: Display): void
	{
		var world = universe.world;
		var map = this;

		var mapPos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = this._cellPos;
		var drawable = this._drawable;
		var drawPos = drawable.locatable().loc.pos;
		var cellSizeInPixels = map.cellSizeInPixels;

		//var posSaved = Coords.create();

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, drawable, null
		);

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
				terrainVisual.draw(uwpe, display);

				var cellEntity = map.bodyAtPosInCells(cellPos);
				if (cellEntity != null)
				{
					uwpe.entity2Set(cellEntity);
					var cellBodyVisual = cellEntity.drawable().visual;
					cellBodyVisual.draw(uwpe, display);
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
				Coords.fromXY(10, 10), null, Color.byName("Cyan"), null
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
						var visualNotAllowed = VisualText.fromTextHeightAndColor
						(
							"X", this.cellSizeInPixels.y, Color.byName("Red"),
						);
						visualNotAllowed.draw
						(
							uwpe, display
						);
					}
				}

				cursorVisual.draw(uwpe, display);
			}
		}
	}
}
