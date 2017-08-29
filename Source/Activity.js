
function Activity(defnName, variables)
{
	this.defnName = defnName;
	this.variables = variables;
}

{
	Activity.prototype.defn = function()
	{
		return (Globals.Instance.universe.activityDefns[this.defnName]);
	}

	Activity.prototype.perform = function(actor)
	{
		this.defn().perform(actor, this);
	}
}
