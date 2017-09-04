
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
			new VisualRectangle(new Coords(10, 10), Color.Instances.Brown.systemColor),
		])
	);

	// controls

	Cursor.prototype.controlBuild_Selection = function()
	{
		return this.bodyParent.controlBuild_Selection();
	}
}
