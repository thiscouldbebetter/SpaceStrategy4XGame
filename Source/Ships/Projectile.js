
class Projectile
{
	constructor(shipParent)
	{
		this.shipParent = shipParent;
	}

	bodyDefnBuild()
	{
		var scaleFactor = 10;
		var bodyDefn = new BodyDefn
		(
			"Projectile",
			new Coords(1, 1).multiplyScalar(scaleFactor), // size
			new VisualCircle(3, Color.byName("Yellow"))
		);

		return bodyDefn;
	}
}

