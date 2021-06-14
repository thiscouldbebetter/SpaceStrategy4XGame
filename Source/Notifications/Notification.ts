
class Notification2
{
	defnName: string;
	turnCreated: number;
	message: string;
	locus: any;

	constructor(defnName: string, turnCreated: number, message: string, locus: any)
	{
		this.defnName = defnName;
		this.turnCreated = turnCreated;
		this.message = message;
		this.locus = locus;
	}

	defn(): NotificationType
	{
		return NotificationType.Instances()._AllByName.get(this.defnName);
	}

	toString(): string
	{
		var returnValue =
			this.turnCreated + " - "
			+ this.locus.toString() + " - "
			+ this.message;
		return returnValue;
	}
}
