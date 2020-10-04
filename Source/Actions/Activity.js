
class Activity
{
	constructor(defnName, target)
	{
		this.defnName = defnName;
		this.target = target;
	}

	defn(universe)
	{
		return (universe.world.activityDefns[this.defnName]);
	}

	perform(universe, actor)
	{
		this.defn(universe).perform(universe, actor, this);
	}
}
