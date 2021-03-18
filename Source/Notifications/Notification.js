
class Notification
{
	constructor(typeName, turnCreated, message, loc)
	{
		this.typeName = typeName;
		this.turnCreated = turnCreated;
		this.message = message;
		this._locatable = new Locatable(loc);
	}

	defn()
	{
		return NotificationType.Instances()._AllByName.get(this.defnName);
	}

	locatable()
	{
		return this._locatable;
	}

	toString()
	{
		var returnValue =
			this.turnCreated + " - "
			+ this.locatable().loc.name + " - "
			+ this.message;
		return returnValue;
	}
}
