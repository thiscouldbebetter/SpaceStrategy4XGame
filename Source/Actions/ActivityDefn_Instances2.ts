
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
			(u: Universe, w: World, p: Place, e: Entity) =>
			{
				var ship = e as Ship;
				var activity = e.actor().activity;
				ship.moveTowardTarget
				(
					u, activity.target(), ship
				);
			}
		);

		this._All =
		[
			this.MoveToTarget,
		];
	}
}
