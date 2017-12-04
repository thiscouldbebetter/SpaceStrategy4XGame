
function Activity(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}

{
	Activity.prototype.defn = function(universe)
	{
		return (universe.world.activityDefns[this.defnName]);
	}

	Activity.prototype.perform = function(universe, actor)
	{
		this.defn(universe).perform(universe, actor, this);
	}
}
