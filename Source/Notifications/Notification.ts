
class Notification2
{
	defnName: string;
	turnCreated: number;
	message: string;
	locus: any;

	constructor
	(
		defnName: string, turnCreated: number, message: string, locus: any
	)
	{
		this.defnName = defnName;
		this.turnCreated = turnCreated;
		this.message = message;
		this.locus = locus;
	}

	defn(): NotificationType
	{
		return (this.defnName == null ? null : NotificationType.byName(this.defnName) );
	}

	jumpTo(universe: Universe): void
	{
		this.locus.jumpTo(universe);
	}

	toString(): string
	{
		var returnValue =
			this.turnCreated + " - "
			+ this.locus.name + " - "
			+ this.message;
		return returnValue;
	}
}
