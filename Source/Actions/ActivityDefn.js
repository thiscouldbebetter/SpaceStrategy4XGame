
function ActivityDefn(name, perform)
{
	this.name = name;
	this.perform = perform;
}

{
	ActivityDefn.Instances = new ActivityDefn_Instances();

	function ActivityDefn_Instances()
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
