
function Notification(typeName, turnCreated, message, loc)
{
	this.typeName = typeName;
	this.turnCreated = turnCreated;
	this.message = message;
	this.loc = loc;

	this.hasBeenRead = false;
}

{
	Notification.prototype.defn = function()
	{
		return NotificationType.Instances._All[this.defnName];
	}

	Notification.prototype.toString = function()
	{
		var returnValue = 
			(this.hasBeenRead == false ? "*" : "") 
			+ this.turnCreated + " - "
			+ this.loc.name + " - "
			+ this.message;
		return returnValue;
	}
}
