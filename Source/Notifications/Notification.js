
function Notification(typeName, turnCreated, message, loc)
{
	this.typeName = typeName;
	this.turnCreated = turnCreated;
	this.message = message;
	this.Locatable = new Locatable(loc);
}

{
	Notification.prototype.defn = function()
	{
		return NotificationType.Instances._All[this.defnName];
	};

	Notification.prototype.toString = function()
	{
		var returnValue =
			this.turnCreated + " - "
			+ this.Locatable.loc.name + " - "
			+ this.message;
		return returnValue;
	};
}
