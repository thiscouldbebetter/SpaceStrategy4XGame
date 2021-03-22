
class ActivityDefn
{
	name: string;
	perform: (u: Universe, actor: Actor, acitivity: Activity) => void;

	constructor
	(
		name: string,
		perform: (u: Universe, actor: Actor, activity: Activity) => void
	)
	{
		this.name = name;
		this.perform = perform;
	}

	static _instances: ActivityDefn_Instances;
	static Instances()
	{
		if (ActivityDefn._instances == null)
		{
			ActivityDefn._instances = new ActivityDefn_Instances();
		}
		return ActivityDefn._instances;
	}
}

class ActivityDefn_Instances
{
	DoNothing: ActivityDefn;
	MoveToTarget: ActivityDefn;

	_All: ActivityDefn[];

	constructor()
	{
		this.DoNothing = new ActivityDefn
		(
			"DoNothing",
			(universe: Universe, actor: Actor, activity: Activity) =>
			{
				// do nothing
			}
		);

		this.MoveToTarget = new ActivityDefn
		(
			"MoveToTarget",
			(universe: Universe, actor: Actor, activity: Activity) =>
			{
				var ship = actor as Ship;
				ship.moveTowardTarget
				(
					universe, activity.target, ship
				);
			}
		);

		this._All =
		[
			this.DoNothing,
			this.MoveToTarget,
		];
	}
}
