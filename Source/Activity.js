
function Activity(defnName, variables)
{
	this.defnName = defnName;
	this.variables = variables;
}

{
	Activity.prototype.defn = function(universe)
	{
		return (universe.activityDefns[this.defnName]);
	}

	Activity.prototype.perform = function(actor)
	{
		this.defn().perform(actor, this);
	}
}
