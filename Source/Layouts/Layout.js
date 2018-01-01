
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

	this._industryPerTurnRef = new Reference(0);
	this._prosperityPerTurnRef = new Reference(0);
	this._researchPerTurnRef = new Reference(0);
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
				new Buildable("Hub", new Coords(4, 4))
			] 
		);

		return layout;
	}

	// instance methods

	Layout.prototype.buildableInProgress = function()
	{
		var returnValue = null;

		var buildables = this.bodies;
		for (var i = 0; i < buildables.length; i++)
		{
			var buildable = buildables[i];
			if (buildable.isComplete() == false)
			{
				returnValue = buildable;
				break;
			}
		}

		return returnValue;
	}

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

	Layout.prototype.facilities = function()
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

	Layout.prototype.initialize = function(universe)
	{
		var world = universe.world;
		this.industryPerTurn(universe, world);
		this.prosperityPerTurn(universe, world);
		this.researchPerTurn(universe, world);
	}

	Layout.prototype.industryPerTurn = function(universe, world, faction, planet)
	{
		var sumSoFar = 0;

		var facilities = this.facilities();
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			if (facility.isComplete() != null)
			{
				var facilityDefn = facility.defn(world);
				var producedThisTurn = facilityDefn.industryPerTurn;
				sumSoFar += producedThisTurn;
			}
		}

		this._industryPerTurnRef.set(sumSoFar);

		return sumSoFar;
	}

	Layout.prototype.prosperityPerTurn = function(universe, world, faction, planet)
	{
		var sumSoFar = 0;

		var facilities = this.facilities();
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			if (facility.isComplete() == true)
			{
				var facilityDefn = facility.defn(world);
				var producedThisTurn = facilityDefn.prosperityPerTurn;
				sumSoFar += producedThisTurn;
			}
		}

		this._prosperityPerTurnRef.set(sumSoFar);

		return sumSoFar;
	}

	Layout.prototype.researchPerTurn = function(universe, world, faction, planet)
	{
		var sumSoFar = 0;

		var facilities = this.facilities();
		for (var i = 0; i < facilities.length; i++)
		{
			var facility = facilities[i];
			if (facility.isComplete() == true)
			{
				var facilityDefn = facility.defn(world);
				var producedThisTurn = facilityDefn.researchPerTurn;
				sumSoFar += producedThisTurn;
			}
		}

		this._researchPerTurnRef.set(sumSoFar);

		return sumSoFar;
	}

	Layout.prototype.updateForTurn = function(universe, world, faction, parentModel)
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
					cellBody.updateForTurn(universe, world, faction, parentModel, this);
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
