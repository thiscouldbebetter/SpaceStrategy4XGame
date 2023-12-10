
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
	ShipDrive: BuildableCategory;
	ShipGenerator: BuildableCategory;
	ShipItem: BuildableCategory;
	ShipSensor: BuildableCategory;
	ShipShield: BuildableCategory;
	ShipStarlaneDrive: BuildableCategory;
	ShipWeapon: BuildableCategory;

	constructor()
	{
		this.ShipDrive 			= new BuildableCategory("Ship Drive");
		this.ShipGenerator 		= new BuildableCategory("Ship Generator");
		this.ShipItem 			= new BuildableCategory("Ship Item");
		this.ShipSensor 		= new BuildableCategory("Ship Sensor");
		this.ShipShield 		= new BuildableCategory("Ship Shield");
		this.ShipStarlaneDrive 	= new BuildableCategory("Ship Starlane Drive");
		this.ShipWeapon 		= new BuildableCategory("Ship Weapon");
	}
}