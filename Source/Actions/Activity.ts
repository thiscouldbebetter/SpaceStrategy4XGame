
class Activity
{
	defnName: string;
	target: any;

	constructor(defnName: string, target: any)
	{
		this.defnName = defnName;
		this.target = target;
	}

	defn(universe: Universe)
	{
		return (universe.world as WorldExtended).activityDefnByName(this.defnName);
	}

	perform(universe: Universe, actor: Actor)
	{
		this.defn(universe).perform(universe, actor, this);
	}
}
