
function Starsystem(name, size, star, linkPortals, planets, factionName)
{
	this.name = name;
	this.size = size;

	this.star = star;
	this.linkPortals = linkPortals;
	this.planets = planets;
	this.factionName = factionName;

	this.ships = [];
}

{
	// constants

	Starsystem.SizeStandard = new Coords(100, 100, 100);

	// static methods

	Starsystem.generateRandom = function(universe)
	{
		var name = NameGenerator.generateName();
		var size = Starsystem.SizeStandard;

		var star = new Body
		(
			"Star", 
			new BodyDefn
			(
				"Star", 
				new Coords(40, 40), // size
				new VisualGroup
				([
					new VisualCircle(40, Color.Instances.Yellow.systemColor, Color.Instances.Yellow.systemColor),
					new VisualText(name)
				])
			),
			new Coords(0, 0, -10)
		);

		var numberOfPlanetsMin = 1;
		var numberOfPlanetsMax = 4;
		var numberOfPlanetsRange = 
			numberOfPlanetsMax - numberOfPlanetsMin;
		var numberOfPlanets = numberOfPlanetsMin + Math.floor
		(
			Math.random() * numberOfPlanetsRange
		);

		var spaceBetweenPlanets = 40;

		var planets = [];
		for (var i = 0; i < numberOfPlanets; i++)
		{
			var planetName = name + " " + (i + 1);

			var planet = new Planet
			(
				planetName,
				null, // factionName
				// pos
				new Coords().randomize().multiply
				(
					size
				).multiplyScalar
				(
					2
				).subtract
				(
					size
				),
				new PlanetDemographics(1),
				new PlanetIndustry(0, null),
				null // layout
			);

			planet.layout = Layout.generateRandom(universe, planet);

			planets.push(planet);
		}

		var returnValue = new Starsystem
		(
			name,
			size,
			star,
			[], // linkPortals - generated later
			planets
		);

		return returnValue;
	}

	// instance methods

	Starsystem.prototype.faction = function(universe)
	{
		return (this.factionName == null ? null : universe.world.factions[this.factionName]);
	}

	Starsystem.prototype.links = function()
	{
		var returnValues = [];

		for (var i = 0; i < this.linkPortals.length; i++)
		{
			var linkPortal = this.linkPortals[i];
			var link = linkPortal.link();
			returnValues.push(link);
		}

		return returnValues;
	}

	// moves

	Starsystem.prototype.updateForMove = function()
	{
		alert("todo");
	}	

	// turns

	Starsystem.prototype.updateForTurn = function()
	{
		for (var i = 0; i < this.bodies.length; i++)
		{
			var body = this.bodies[i];
			if (body.updateForTurn != null)
			{
				body.updateForTurn();
			}
		}
	}

	// drawing

	Starsystem.prototype.drawToDisplayForCamera = function(universe, display, camera)
	{
		var starsystem = this;
		var cameraViewSize = camera.viewSize;
		var cameraPos = camera.loc.pos;

		var drawPos = display.drawPos;
		var drawPosFrom = new Coords(0, 0, 0);
		var drawPosTo = new Coords(0, 0, 0);

		var gridCellSizeInPixels = new Coords(10, 10, 0);
		var gridSizeInCells = new Coords(40, 40, 0); 
		var gridSizeInPixels = gridSizeInCells.clone().multiply
		(
			gridCellSizeInPixels
		);
		var gridSizeInCellsHalf = gridSizeInCells.clone().divideScalar(2);
		var gridSizeInPixelsHalf = gridSizeInPixels.clone().divideScalar(2);

		var graphics = display.graphics;

		graphics.strokeStyle = Color.Instances.CyanHalfTranslucent.systemColor;

		for (var d = 0; d < 2; d++)
		{
			var multiplier = new Coords(0, 0, 0);
			multiplier.dimension(d, gridCellSizeInPixels.dimension(d));

			for (var i = 0 - gridSizeInCellsHalf.x; i <= gridSizeInCellsHalf.x; i++)			
			{
				drawPosFrom.overwriteWith
				(
					gridSizeInPixelsHalf
				).multiplyScalar(-1);
				drawPosTo.overwriteWith(gridSizeInPixelsHalf);

				drawPosFrom.dimension(d, 0);
				drawPosTo.dimension(d, 0);

				drawPosFrom.add(multiplier.clone().multiplyScalar(i));
				drawPosTo.add(multiplier.clone().multiplyScalar(i));

				camera.coordsTransformWorldToView(drawPosFrom);
				camera.coordsTransformWorldToView(drawPosTo);

				graphics.beginPath();
				graphics.moveTo(drawPosFrom.x, drawPosFrom.y);
				graphics.lineTo(drawPosTo.x, drawPosTo.y);
				graphics.stroke();
			}
		}

		var bodiesByType =
		[
			[ starsystem.star ],
			starsystem.linkPortals,
			starsystem.planets,
			starsystem.ships,
		];

		for (var t = 0; t < bodiesByType.length; t++)
		{
			var bodies = bodiesByType[t];

			for (var i = 0; i < bodies.length; i++)
			{
				var body = bodies[i];
				this.drawToDisplayForCamera_Body
				(
					universe,
					display,
					camera, 
					body
				);
			}

		}
	}

	Starsystem.prototype.drawToDisplayForCamera_Body = function(universe, display, camera, body)
	{
		var graphics = display.graphics;
		var drawPos = new Coords();
		var drawLoc = new Location(drawPos);

		var bodyPos = body.loc.pos;
		drawPos.overwriteWith(bodyPos);
		camera.coordsTransformWorldToView(drawPos);

		var bodyDefn = body.defn;
		var bodyVisual = bodyDefn.visual;
		bodyVisual.draw(universe, display, body, drawLoc);

		if (bodyPos.z < 0)
		{
			graphics.strokeStyle = Color.Instances.Green.systemColor;
		}
		else
		{
			graphics.strokeStyle = Color.Instances.Red.systemColor;
		}

		graphics.beginPath();
		graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.overwriteWith(bodyPos);
		drawPos.z = 0;
		camera.coordsTransformWorldToView(drawPos);

		graphics.lineTo(drawPos.x, drawPos.y);
		graphics.stroke();
	}	
}
