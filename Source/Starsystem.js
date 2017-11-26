
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

	Starsystem.generateRandom = function()
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
					new VisualCircle(40, null, Color.Instances.Yellow.systemColor),
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

			planet.layout = Layout.generateRandom(planet);

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

	Starsystem.prototype.faction = function()
	{
		return (this.factionName == null ? null : Globals.Instance.universe.world.factions[this.factionName]);
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
	
}
