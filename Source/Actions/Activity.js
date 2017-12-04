
function Activity(defnName, variables)
{
	this.defnName = defnName;
	this.variables = variables;
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
