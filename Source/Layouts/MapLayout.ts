
class MapLayout
{
	sizeInPixels: Coords;
	pos: Coords;
	terrains: MapTerrain[];
	cellsAsStrings: string[];
	private _entities: Entity[];

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
		entities: Entity[]
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
		this._entities = entities;

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

	entities(): Entity[]
	{
		return this._entities;
	}

	entitiesNeighboringCursor(): Entity[]
	{
		return this.entitiesNeighboringPosInCells(this.cursor.pos);
	}

	entitiesNeighboringPosInCells(centerPosInCells: Coords): Entity[]
	{
		var returnValues = new Array<Entity>();

		var neighborPos = this._cellPos;

		for (var n = 0; n < this._neighborOffsets.length; n++)
		{
			var neighborOffset = this._neighborOffsets[n];
			neighborPos.overwriteWith(neighborOffset).add(centerPosInCells);
			var entityAtNeighborPos = this.entityAtPosInCells(neighborPos);
			if (entityAtNeighborPos != null)
			{
				returnValues.push(entityAtNeighborPos);
			}
		}

		return returnValues;
	}

	entityAdd(entityToAdd: Entity): void
	{
		this._entities.push(entityToAdd);
	}

	entityAtPosInCells(cellPos: Coords): Entity
	{
		var returnValue = null;
		var entities = this.entities();
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			var entityPos = entity.locatable().loc.pos;
			if (entityPos.equals(cellPos))
			{
				returnValue = entity;
				break;
			}
		}
		return returnValue;
	}

	entityAtCursor(): Entity
	{
		return this.entityAtPosInCells(this.cursor.pos);
	}

	entityRemove(entityToRemove: Entity): void
	{
		this._entities.splice
		(
			this._entities.indexOf(entityToRemove), 1
		);
	}

	terrainAtCursor(): MapTerrain
	{
		return this.terrainAtPosInCells(this.cursor.pos);
	}

	terrainAtPosInCells(cellPos: Coords): MapTerrain
	{
		var terrainCode = this.cellsAsStrings[cellPos.y][cellPos.x];
		var returnValue = this.terrainByCode(terrainCode);
		return returnValue;
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

		var venue = universe.venueCurrent() as VenueLayout;
		var planet = venue.modelParent as Planet;
		var planetAsPlace = (planet == null ? null : planet.toPlace() );

		var mapPos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = this._cellPos;
		var drawable = this._drawable;
		var drawPos = drawable.locatable().loc.pos;
		var cellSizeInPixels = map.cellSizeInPixels;

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, planetAsPlace, drawable, null
		);
		
		var posToRestoreAfterDraw = Coords.create();

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
				uwpe.entitySet(drawable);
				terrainVisual.draw(uwpe, display);

				var cellEntity = map.entityAtPosInCells(cellPos);
				if (cellEntity != null)
				{
					var entityPos = cellEntity.locatable().loc.pos;
					posToRestoreAfterDraw.overwriteWith(entityPos);
					entityPos.overwriteWith(drawPos);
					var cellBodyVisual = cellEntity.drawable().visual;
					uwpe.entitySet(cellEntity);
					cellBodyVisual.draw(uwpe, display);
					entityPos.overwriteWith(posToRestoreAfterDraw);
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
					var entityVisual = buildableDefn.visual;
					entityVisual.draw(universe, world, null, drawable, display);

					var isBuildableAllowedOnCell =
						buildableDefn.canBeBuiltOnMapAtPosInCells(map, cursorPos);

					if (isBuildableAllowedOnCell == false)
					{
						var visualNotAllowed = VisualText.fromTextImmediateFontAndColor
						(
							"X",
							FontNameAndHeight.fromHeightInPixels(this.cellSizeInPixels.y),
							Color.byName("Red"),
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
