
function Cursor(bodyParent)
{
	this.bodyParent = bodyParent;
	this.hasXYPositionBeenSpecified = false;
	this.hasZPositionBeenSpecified = false;

	this.defn = Cursor.BodyDefn();

	this.loc = new Location(new Coords(0, 0, 0));
	if (this.bodyParent.loc != null)
	{
		this.loc.overwriteWith(this.bodyParent.loc);
	}

	this.constraints = 
	[
		new Constraint_Cursor()
	];
}

{
	Cursor.BodyDefn = function()
	{
		if (Cursor._bodyDefn == null)
		{
			var radius = 5;
			var color = Color.Instances().White.systemColor;

			Cursor._bodyDefn = new BodyDefn
			(
				"Cursor", 
				new Coords(10, 10), // size
				new VisualGroup
				([
					new VisualCircle(radius, null, color),
					new VisualLine(new Coords(-radius, 0), new Coords(radius, 0), color),
					new VisualLine(new Coords(0, -radius), new Coords(0, radius), color),
				])
			);
		}
		return Cursor._bodyDefn;
	}

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
