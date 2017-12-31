
function Layout(modelParent, sizeInPixels, bodyDefns, map, bodies)
{
	this.modelParent = modelParent;
	this.sizeInPixels = sizeInPixels;
	this.bodyDefns = bodyDefns;
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

	Layout.generateRandom = function(universe, parent)
	{
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

		var bodyDefns = 
		[
			new LayoutElementDefn
			(
				"Hub", 100, ["Surface"], 1, 1, 1,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, "Gray"),
					new VisualText("H", "White", "Gray")
				])
			),
			new LayoutElementDefn
			(
				"Factory", 30, ["Surface"], 0, 1, 0,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, "Red"),
					new VisualText("F", "White", "Gray")
				])
			),
			new LayoutElementDefn
			(
				"Plantation", 30, ["Surface"], 1, 0, 0,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, "Green"),
					new VisualText("P", "White", "Gray")
				])
			),
			new LayoutElementDefn
			(
				"Laboratory", 30, ["Surface"], 0, 0, 1,
				new VisualGroup
				([
					new VisualRectangle(mapCellSizeInPixels, "Blue"),
					new VisualText("L", "White", "Gray")
				])
			),

			new LayoutElementDefn
			(
				"Shipyard", 30, ["Orbit"], 0, 0, 1,
				new VisualGroup([new VisualRectangle(mapCellSizeInPixels, "Orange")])
			),
		];
		bodyDefns.addLookups("name");

		var layout = new Layout
		(
			parent,
			viewSize.clone(), // sizeInPixels
			bodyDefns,
			map,
			// bodies
			[
				new LayoutElement(bodyDefns["Hub"], new Coords(4, 4))
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

	Layout.prototype.industryPerTurn = function(universe, faction, planet)
	{
		var returnValue = 0;

		var facilities = this.facilities(universe);
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			var facilityDefn = facility.defn;
			var producedThisTurn = facilityDefn.industryPerTurn;
			returnValue += producedThisTurn;
		}

		return returnValue;
	}

	Layout.prototype.prosperityPerTurn = function(universe, faction, planet)
	{
		var returnValue = 0;

		var facilities = this.facilities(universe);
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			var facilityDefn = facility.defn;
			var producedThisTurn = facilityDefn.prosperityPerTurn;
			returnValue += producedThisTurn;
		}

		return returnValue;
	}

	Layout.prototype.researchPerTurn = function(universe, faction, planet)
	{
		var returnValue = 0;

		var facilities = this.facilities(universe);
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			var facilityDefn = facility.defn;
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
		display.clear();
		this.map.draw(universe, display);
	}
}
