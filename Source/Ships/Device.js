
function Device(defn)
{
	this.defn = defn;
}

{
	Device.prototype.updateForTurn = function(universe, actor)
	{
		this.defn.updateForTurn(universe, actor, this);
	}

	Device.prototype.use = function(universe, place, actor)
	{
		this.defn.use(universe, place, actor, this);
	}
}
