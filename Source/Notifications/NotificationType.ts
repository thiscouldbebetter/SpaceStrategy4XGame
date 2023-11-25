
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

	static byName(name: string): NotificationType
	{
		return NotificationType.Instances().byName(name);
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

	byName(name: string): NotificationType
	{
		return (this._AllByName.has(name) ? this._AllByName.get(name) : this.Default);
	}
}
