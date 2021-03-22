
class NotificationType
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: NotificationType_Instances;
	static Instances()
	{
		if (NotificationType._instances == null)
		{
			NotificationType._instances = new NotificationType_Instances();
		}
		return NotificationType._instances;
	}
}

class NotificationType_Instances
{
	Default: NotificationType;
	_All: NotificationType[];
	_AllByName: Map<string,NotificationType>

	constructor()
	{
		this.Default = new NotificationType("Default");
		this._All = [ this.Default ];
		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}
