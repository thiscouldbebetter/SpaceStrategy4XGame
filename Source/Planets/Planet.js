
function Planet(name, factionName, pos, demographics, industry, layout)
{
	this.name = name;
	this.factionName = factionName;
	this.loc = new Location(pos);
	this.demographics = demographics;
	this.industry = industry;
	this.layout = layout;

	this.defn = Planet.BodyDefn();

	this.ships = [];
}

{
	// constants

	Planet.BodyDefn = function()
	{
		if (Planet._bodyDefn == null)
		{
			Planet._bodyDefn = new BodyDefn
			(
				"Planet", 
				new Coords(10, 10), // size
				new VisualGroup
				([
					new VisualCircleGradient
					(
						10, // radius
						new Gradient
						([
							new GradientStop(0, "White"),
							new GradientStop(.2, "White"),
							new GradientStop(.3, "Cyan"),
							new GradientStop(.75, "Cyan"),
							new GradientStop(1, "Black"), 
						])
					),
					new VisualDynamic
					(
						function visual(drawable)
						{
							var returnValue = null;
							if (drawable.factionName == null)
							{
								returnValue = new VisualNone();
							}
							else
							{
								returnValue = new VisualOffset
								(
									new VisualText(drawable.factionName, "White"),
									new Coords(0, 16)
								)
							}
							return returnValue;
						}
					)
				])
			);
		}

		return Planet._bodyDefn;
	}

	// instance methods

	Planet.prototype.faction = function(world)
	{
		return (this.factionName == null ? null : world.factions[this.factionName]);
	}

	// controls

	Planet.prototype.controlBuild = function(universe, size)
	{
		var returnValue = new ControlContainer
		(
			"containerPlanet",
			new Coords(0, 0), // pos
			size,
			[
				new ControlLabel
				(
					"labelName",
					new Coords(0, 0), // pos
					new Coords(size.x, 0), // size
					false, // isTextCentered
					new DataBinding(this.name),
					10 // fontHeightInPixels
				)
			]
		);

		return returnValue;
	}

	// diplomacy

	Planet.prototype.strength = function()
	{
		return 1;
	}

	// turns

	Planet.prototype.industryPerTurn = function(universe, faction)
	{
		return this.layout.industryPerTurn(universe, faction, this);
	}

	Planet.prototype.prosperityPerTurn = function(universe, faction)
	{
		return this.layout.prosperityPerTurn(universe, faction, this);
	}

	Planet.prototype.researchPerTurn = function(universe, faction)
	{
		return this.layout.researchPerTurn(universe, faction, this);
	}

	Planet.prototype.updateForTurn = function(universe, faction)
	{
		this.layout.updateForTurn(universe, faction, this);
		this.industry.updateForTurn(universe, faction, this);
		this.demographics.updateForTurn(universe, faction, this);
	}
}
