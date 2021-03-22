
class Constraint_LookAt implements Constraint
{
	targetPos: Coords;

	name: string;

	constructor(targetPos: Coords)
	{
		this.name = "LookAt";
		this.targetPos = targetPos;
	}

	constrain(universe: Universe, world: World, place: Place, body: Entity)
	{
		var bodyLoc = body.locatable().loc;
		var bodyPos = bodyLoc.pos;
		var bodyOrientation = bodyLoc.orientation;

		var bodyOrientationForwardNew = this.targetPos.clone().subtract
		(
			bodyPos
		).normalize();

		bodyOrientation.forwardSet(bodyOrientationForwardNew);
	}
}
