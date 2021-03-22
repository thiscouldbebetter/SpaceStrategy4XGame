
class NetworkNodeDefn
{
	name: string;
	colorName: string;

	constructor(name: string, colorName: string)
	{
		this.name = name;
		this.colorName = colorName;
	}

	static _instances: NetworkNodeDefn_Instances;
	static Instances()
	{
		if (NetworkNodeDefn._instances == null)
		{
			NetworkNodeDefn._instances = new NetworkNodeDefn_Instances();
		}
		return NetworkNodeDefn._instances;
	}
}

class NetworkNodeDefn_Instances
{
	Blue: NetworkNodeDefn;
	Green: NetworkNodeDefn;
	Red: NetworkNodeDefn;

	_All: NetworkNodeDefn[];

	constructor()
	{
		this.Blue = new NetworkNodeDefn("Blue", "GrayLight");
		this.Green = new NetworkNodeDefn("Green", "GrayLight");
		this.Red = new NetworkNodeDefn("Red", "GrayLight");

		this._All =
		[
			this.Blue,
			this.Green,
			this.Red,
		];
	}
}
