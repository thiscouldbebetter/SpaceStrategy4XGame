
class Constraint_LookAt implements Constraint
{
	targetPos: Coords;

	name: string;

	constructor(targetPos: Coords)
	{
		this.name = "LookAt";
		this.targetPos = targetPos;
	}

	static default(): Constraint_LookAt
	{
		return new Constraint_LookAt(Coords.zeroes());
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var body = uwpe.entity;
		var bodyLoc = body.locatable().loc;
		var bodyPos = bodyLoc.pos;
		var bodyOrientation = bodyLoc.orientation;

		var bodyOrientationForwardNew = this.targetPos.clone().subtract
		(
			bodyPos
		).normalize();

		bodyOrientation.forwardSet(bodyOrientationForwardNew);
	}

	// Clonable.
	clone(): Constraint { return this; }
	overwriteWith(other: Constraint): Constraint { return this; }
}
