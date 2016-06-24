
function Device(defn)
{
	this.defn = defn;
}

{
	Device.prototype.use = function(actor, target)
	{
		this.defn.use(actor, this, target);
	}
}
