
class ActivityDefn_Instances2
{
	DoNothing: ActivityDefn;
	MoveToTarget: ActivityDefn;

	_All: ActivityDefn[];

	constructor()
	{
		this.MoveToTarget = new ActivityDefn
		(
			"MoveToTarget",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var ship = uwpe.entity as Ship;
				var activity = ship.actor().activity;
				ship.moveTowardTarget
				(
					uwpe, activity.targetEntity(), ship
				);
			}
		);

		this._All =
		[
			this.MoveToTarget,
		];
	}
}
