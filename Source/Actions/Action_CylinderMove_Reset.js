
class Action_CylinderMove_Reset
{
	perform(actor)
	{
		var constraint =
			actor.constrainable().constraintsByName.get("PositionOnCylinder");
		constraint.center.clear();
		constraint.orientation.forwardDownSet
		(
			new Coords(1, 0, 0),
			new Coords(0, 0, 1) // axis
		);
		constraint.yawInTurns = 0;
		var camera = actor;
		constraint.radius = camera.focalLength;
		constraint.distanceFromCenterAlongAxis =
			0 - camera.focalLength / 2 ;
	}
}
