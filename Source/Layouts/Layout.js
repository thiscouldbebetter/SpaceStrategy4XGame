
function Layout(modelParent, sizeInPixels, map, bodies)
{
	this.modelParent = modelParent;
	this.sizeInPixels = sizeInPixels;
	this.map = map;
	this.bodies = bodies;

	this.name = this.modelParent.name;

	for (var i = 0; i < this.bodies.length; i++)
	{
		var body = this.bodies[i];
		var bodyPosInCells = body.loc.pos;
		var cell = this.map.cellAtPos(bodyPosInCells);
		cell.body = body;
	}
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

		var map = Map.fromCellsAsStrings
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
			]
		);

		var layout = new Layout
		(
			planet,
			viewSize.clone(), // sizeInPixels
			map,
			// bodies
			[
				new LayoutElement("Hub", new Coords(4, 4))
			] 
		);

		return layout;
	}

	// instance methods

	Layout.prototype.elementAdd = function(elementToAdd)
	{
		this.bodies.push(elementToAdd);
		this.map.cellAtPos(elementToAdd.loc.pos).body = elementToAdd;
	}

	Layout.prototype.elementRemove = function(elementToRemove)
	{
		this.bodies.remove(elementToRemove);
		var elementPos = elementToRemove.loc.pos;
		var cell = this.map.cellAtPos(elementPos);
		cell.body = null;
	}

	// turnable


	Layout.prototype.facilities = function(universe, faction, planet)
	{
		var returnValues = [];

		var cells = this.map.cells;
		for (var i = 0; i < cells.length; i++)
		{
			var cell = cells[i];
			var facility = cell.body;
			if (facility != null)
			{
				returnValues.push(facility);
			}
		}

		return returnValues;
	}

	Layout.prototype.industryPerTurn = function(layout, universe)
	{
		var returnValue = 0;

		var world = universe.world;

		var facilities = this.facilities(universe);
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			var facilityDefn = facility.defn(universe.world);
			var producedThisTurn = facilityDefn.industryPerTurn;
			returnValue += producedThisTurn;
		}

		return returnValue;
	}

	Layout.prototype.prosperityPerTurn = function(layout, universe)
	{
		var returnValue = 0;

		var facilities = this.facilities(universe);
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			var facilityDefn = facility.defn(universe.world);
			var producedThisTurn = facilityDefn.prosperityPerTurn;
			returnValue += producedThisTurn;
		}

		return returnValue;
	}

	Layout.prototype.researchPerTurn = function(layout, universe)
	{
		var returnValue = 0;

		var facilities = this.facilities(universe);
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			var facilityDefn = facility.defn(universe.world);
			var producedThisTurn = facilityDefn.researchPerTurn;
			returnValue += producedThisTurn;
		}

		return returnValue;
	}


	Layout.prototype.updateForTurn = function(universe, parent)
	{
		var cells = this.map.cells;
		for (var i = 0; i < cells.length; i++)
		{
			var cell = cells[i];
			var cellBody = cell.body;
			if (cellBody != null)
			{
				if (cellBody.updateForTurn != null)
				{
					cellBody.updateForTurn(universe);
				}
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
