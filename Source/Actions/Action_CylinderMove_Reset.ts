
class Action_CylinderMove_Reset
{
	perform(actor: Entity)
	{
		var constraintAsConstraint =
			actor.constrainable().constraintByClassName(Constraint_PositionOnCylinder.name);
		var constraint = constraintAsConstraint as Constraint_PositionOnCylinder;
		constraint.center.clear();
		constraint.orientation.forwardDownSet
		(
			new Coords(1, 0, 0),
			new Coords(0, 0, 1) // axis
		);
		constraint.yawInTurns = 0;
		var camera = actor.camera();
		constraint.radius = camera.focalLength;
		constraint.distanceFromCenterAlongAxis =
			0 - camera.focalLength / 2 ;
	}
}
