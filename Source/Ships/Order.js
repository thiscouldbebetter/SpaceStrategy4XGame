
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
	}

	Order.prototype.obey = function(actor)
	{
		if (this.isComplete == false)
		{
			this.defn().obey(actor, this);
		}
	}
}
