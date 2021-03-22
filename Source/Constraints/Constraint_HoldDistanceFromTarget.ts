
class Constraint_HoldDistanceFromTarget implements Constraint
{
	distanceToHold: number;
	targetPos: Coords;

	name: string;
	displacement: Coords;

	constructor(distanceToHold: number, targetPos: Coords)
	{
		this.name = "HoldDistanceFromTarget";
		this.distanceToHold = distanceToHold;
		this.targetPos = targetPos;

		this.displacement = Coords.create();
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var body = entity;
		var bodyPos = body.locatable().loc.pos;

		var directionOfBodyFromTarget = this.displacement.overwriteWith
		(
			bodyPos
		).subtract
		(
			this.targetPos
		).normalize();

		bodyPos.overwriteWith
		(
			directionOfBodyFromTarget
		).multiplyScalar
		(
			this.distanceToHold
		).add
		(
			this.targetPos
		).round();
	}
}
