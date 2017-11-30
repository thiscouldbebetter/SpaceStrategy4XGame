
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
		var terrains = 
		[
			new MapTerrain("Default", ".", "LightGray", false),
		];
		terrains.addLookups("codeChar");

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

		var map = Map.fromCellsAsStrings
		(
			mapSizeInPixels,
			mapPosInPixels,
			terrains,
			// cellsAsStrings
			[
				"........",
				"........",
				"........",
				"........",
				"........",
				"........",
				"........",
				"........",
			]
		);

		var bodyDefns = 
		[
			new LayoutElementDefn("Default", "Gray", 10),
			new LayoutElementDefn("Factory", "Red", 20),
			new LayoutElementDefn("Farm", "Green", 30),
			new LayoutElementDefn("Laboratory", "Blue", 40),
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
				new LayoutElement(bodyDefns["Default"], new Coords(0, 0))
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
		this.bodies.splice(this.bodies.indexOf(elementToRemove), 1);
		var elementPos = elementToRemove.loc.pos;
		var cell = this.map.cellAtPos(elementPos);
		cell.body = null;
	}

	Layout.prototype.updateForTurn = function()
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
					cellBody.updateForTurn();
				}
			}
		}

	}
}
