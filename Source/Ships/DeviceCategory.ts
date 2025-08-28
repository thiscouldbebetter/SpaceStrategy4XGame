
class DeviceCategory
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: DeviceCategory_Instances;
	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new DeviceCategory_Instances();
		}
		return this._instances;
	}
}

class DeviceCategory_Instances
{
	Drive: DeviceCategory;
	Generator: DeviceCategory;
	Shield: DeviceCategory;
	Special: DeviceCategory;
	Weapon: DeviceCategory;

	_All: DeviceCategory[];
	_AllByName: Map<string,DeviceCategory>;

	constructor()
	{
		this.Drive = new DeviceCategory("Drive");
		this.Generator = new DeviceCategory("Generator");
		this.Shield = new DeviceCategory("Shield");
		this.Special = new DeviceCategory("Special");
		this.Weapon = new DeviceCategory("Weapon");

		this._All =
		[
			this.Drive,
			this.Generator,
			this.Shield,
			this.Special,
			this.Weapon
		];
		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}
