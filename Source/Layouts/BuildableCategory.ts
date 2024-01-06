
class BuildableCategory
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: BuildableCategory_Instances;
	static Instances(): BuildableCategory_Instances
	{
		if (BuildableCategory._instances == null)
		{
			BuildableCategory._instances = new BuildableCategory_Instances();
		}
		return BuildableCategory._instances;
	}
}

class BuildableCategory_Instances
{
	Orbital: BuildableCategory;
	Shield: BuildableCategory;
	ShipDrive: BuildableCategory;
	ShipGenerator: BuildableCategory;
	ShipItem: BuildableCategory;
	ShipSensor: BuildableCategory;
	ShipShield: BuildableCategory;
	ShipStarlaneDrive: BuildableCategory;
	ShipWeapon: BuildableCategory;

	constructor()
	{
		var bc = (name: string) => new BuildableCategory(name);

		this.Orbital 			= bc("Orbital");
		this.Shield 			= bc("Shield");
		this.ShipDrive 			= bc("Ship Drive");
		this.ShipGenerator 		= bc("Ship Generator");
		this.ShipItem 			= bc("Ship Item");
		this.ShipSensor 		= bc("Ship Sensor");
		this.ShipShield 		= bc("Ship Shield");
		this.ShipStarlaneDrive 	= bc("Ship Starlane Drive");
		this.ShipWeapon 		= bc("Ship Weapon");
	}
}