
function Cursor(bodyParent, mustTargetBody)
{
	this.bodyParent = bodyParent;
	this.mustTargetBody = mustTargetBody;
	this.hasXYPositionBeenSpecified = false;
	this.hasZPositionBeenSpecified = false;

	this.defn = Cursor.BodyDefn();

	this.loc = new Location(new Coords(0, 0, 0));

	this.Constrainable = new Constrainable
	([
		new Constraint_Cursor()
	]);
}

{
	Cursor.BodyDefn = function()
	{
		if (Cursor._bodyDefn == null)
		{
			var radius = 5;
			var color = Color.Instances().White.systemColor();

			var bodyDefn = new BodyDefn
			(
				"Cursor",
				new Coords(1, 1).multiplyScalar(radius * 2), // size
				new VisualSelect
				(
					function selectChildName(universe, world, display, drawable, entity, visual)
					{
						var returnValue;
						var cursor = drawable;
						if (cursor.bodyParent == null)
						{
							returnValue = "_0";
						}
						else if (cursor.mustTargetBody)
						{
							returnValue = "_1";
						}
						else
						{
							returnValue = "_1";
						}
						return returnValue;
					},
					[ "_0", "_1" ], // childNames
					// children
					[
						new VisualNone(),
						new VisualGroup
						([
							new VisualCircle(radius, null, color),
							new VisualLine(new Coords(-radius, 0), new Coords(radius, 0), color),
							new VisualLine(new Coords(0, -radius), new Coords(0, radius), color),
						])
					]
				)
			);

			Cursor._bodyDefn = bodyDefn;
		}
		return Cursor._bodyDefn;
	};

	Cursor.prototype.clear = function()
	{
		this.bodyParent = null;
		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;
	};

	// controls

	Cursor.prototype.controlBuild = function(universe, controlSize)
	{
		return this.bodyParent.controlBuild(universe, controlSize);
	};

	// drawable

	Cursor.prototype.draw = function(universe, world, display, venueStarsystem)
	{
		var starsystem = venueStarsystem.starsystem;
		starsystem.draw_Body
		(
			universe,
			world,
			display,
			venueStarsystem.camera,
			this
		);
	};
}
