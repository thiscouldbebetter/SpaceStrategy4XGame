
class StarClusterNodeDefn
{
	name: string;
	colorName: string;

	constructor(name: string, colorName: string)
	{
		this.name = name;
		this.colorName = colorName;
	}

	static _instances: StarClusterNodeDefn_Instances;
	static Instances()
	{
		if (StarClusterNodeDefn._instances == null)
		{
			StarClusterNodeDefn._instances = new StarClusterNodeDefn_Instances();
		}
		return StarClusterNodeDefn._instances;
	}
}

class StarClusterNodeDefn_Instances
{
	Blue: StarClusterNodeDefn;
	Green: StarClusterNodeDefn;
	Red: StarClusterNodeDefn;

	_All: StarClusterNodeDefn[];

	constructor()
	{
		this.Blue = new StarClusterNodeDefn("Blue", "GrayLight");
		this.Green = new StarClusterNodeDefn("Green", "GrayLight");
		this.Red = new StarClusterNodeDefn("Red", "GrayLight");

		this._All =
		[
			this.Blue,
			this.Green,
			this.Red,
		];
	}
}
