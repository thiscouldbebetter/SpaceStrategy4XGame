
function Notification(typeName, turnCreated, message, loc)
{
	this.typeName = typeName;
	this.turnCreated = turnCreated;
	this.message = message;
	this._locatable = new Locatable(loc);
}

{
	Notification.prototype.defn = function()
	{
		return NotificationType.Instances._All[this.defnName];
	};

	Notification.prototype._locatable = function()
	{
		return this._locatable;
	};

	Notification.prototype.toString = function()
	{
		var returnValue =
			this.turnCreated + " - "
			+ this.locatable.loc.name + " - "
			+ this.message;
		return returnValue;
	};
}
