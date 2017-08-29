
function Planet(name, factionName, pos, demographics, industry, layout)
{
	this.name = name;	
	this.factionName = factionName;
	this.loc = new Location(pos);
	this.demographics = demographics;
	this.industry = industry;
	this.layout = layout;

	this.defn = Planet.BodyDefn;
}

{
	// constants

	Planet.BodyDefn = new BodyDefn
	(
		"Planet", 
		new Coords(10, 10), // size
		new VisualGroup
		([
			new VisualSphere(Color.Instances.Cyan, 10),
		])
	);

	// instance methods

	Planet.prototype.faction = function()
	{
		return (this.factionName == null ? null : Globals.Instance.universe.world.factions[this.factionName]);
	}

	// controls

	Planet.prototype.controlBuild_Selection = function()
	{
		var returnValue = new ControlLabel
		(
			"labelPlanetAsSelection",
			new Coords(0, 0),
			new Coords(0, 0), // this.size
			false, // isTextCentered
			new DataBinding(this.name)
		);

		return returnValue;
	}

	// diplomacy

	Planet.prototype.strength = function()
	{
		return 1;
	}

	// turns

	Planet.prototype.updateForTurn = function()
	{	
		this.layout.updateForTurn();
		this.industry.updateForTurn(this);
		this.demographics.updateForTurn(this);
	}
}
