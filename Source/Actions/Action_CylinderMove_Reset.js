
function Action_CylinderMove_Reset()
{
}

{
	Action_CylinderMove_Reset.prototype.perform = function(actor)
	{
		var constraint = actor.constrainable().constraints["PositionOnCylinder"];
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
	};
}
