
function Notification(typeName, message)
{
	this.typeName = typeName;
	this.message = message;	
}

{
	Notification.prototype.defn = function()
	{
		return NotificationType.Instances._All[this.defnName];
	}	
}
