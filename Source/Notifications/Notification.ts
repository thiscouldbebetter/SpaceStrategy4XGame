
class Notification2
{
	defnName: string;
	turnCreated: number;
	message: string;
	locus: string;

	constructor(defnName: string, turnCreated: number, message: string, locus: string)
	{
		this.defnName = defnName;
		this.turnCreated = turnCreated;
		this.message = message;
		this.locus = locus;
	}

	defn()
	{
		return NotificationType.Instances()._AllByName.get(this.defnName);
	}

	toString()
	{
		var returnValue =
			this.turnCreated + " - "
			+ this.locus + " - "
			+ this.message;
		return returnValue;
	}
}
