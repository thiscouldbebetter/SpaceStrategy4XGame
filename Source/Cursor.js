
function Cursor(bodyParent)
{
	this.bodyParent = bodyParent;
	this.hasXYPositionBeenSpecified = false;
	this.hasZPositionBeenSpecified = false;

	this.defn = Cursor.BodyDefn;

	this.loc = this.bodyParent.loc.clone();

	this.constraints = 
	[
		new Constraint_Cursor()
	];
}

{
	Cursor.BodyDefn = new BodyDefn
	(
		"Cursor", 
		new Coords(10, 10), // size
		new VisualGroup
		([
			new VisualRectangle(new Coords(10, 10), null, Color.Instances.Cyan),
		])
	);

	// controls

	Cursor.prototype.controlBuild = function(universe, controlSize)
	{
		return this.bodyParent.controlBuild(universe, controlSize);
	}

	// drawable

	Cursor.prototype.draw = function(universe, display, venueStarsystem)
	{
		var starsystem = venueStarsystem.starsystem;
		starsystem.draw_Body
		(
			universe, 
			display,
			venueStarsystem.camera,
			this
		);
	}
}
