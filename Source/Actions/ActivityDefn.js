
class ActivityDefn
{
	constructor(name, perform)
	{
		this.name = name;
		this.perform = perform;
	}

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
	constructor()
	{
		this.DoNothing = new ActivityDefn
		(
			"DoNothing",
			function(universe, actor, activity)
			{
				// do nothing
			}
		);

		this.MoveToTarget = new ActivityDefn
		(
			"MoveToTarget",
			function perform(universe, actor, activity)
			{
				actor.moveTowardTarget(universe, activity.target);
			}
		);

		this._All =
		[
			this.DoNothing,
			this.MoveToTarget,
		];
	}
}
