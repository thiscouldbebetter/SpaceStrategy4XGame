
function Action_CylinderMove_Reset()
{
}

{
	Action_CylinderMove_Reset.prototype.perform = function(actor)
	{
		var constraint = actor.constraints["PositionOnCylinder"];
		constraint.center.clear();
		constraint.axis.forwardDown
		(
			new Coords(1, 0, 0), 
			new Coords(0, 0, 1) // axis
		);
		constraint.yaw = 0;
		var camera = actor;
		constraint.radius = camera.focalLength;
		constraint.distanceFromCenterAlongAxisMax = 
			0 - this.camera.focalLength / 2 ;
	}
}
