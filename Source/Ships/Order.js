
function Order(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
	this.isComplete = false;
}

{
	Order.prototype.defn = function()
	{
		return OrderDefn.Instances._All[this.defnName];
	};

	Order.prototype.obey = function(universe, actor)
	{
		if (this.isComplete == true)
		{
			actor.order = null;
		}
		else
		{
			this.defn().obey(universe, actor, this);
		}
	};
}
