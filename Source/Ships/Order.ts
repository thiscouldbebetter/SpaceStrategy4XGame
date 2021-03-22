
class Order
{
	defnName: string;
	target: any;
	isComplete: boolean;

	constructor(defnName: string, target: any)
	{
		this.defnName = defnName;
		this.target = target;
		this.isComplete = false;
	}

	defn()
	{
		return OrderDefn.Instances()._AllByName.get(this.defnName);
	}

	obey(universe: Universe, actor: Actor)
	{
		if (this.isComplete)
		{
			actor.order = null;
		}
		else
		{
			this.defn().obey(universe, actor, this);
		}
	}
}
