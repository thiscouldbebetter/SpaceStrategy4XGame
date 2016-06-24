
function NetworkNodeDefn(name, color)
{
	this.name = name;
	this.color = color;
}

{
	function NetworkNodeDefn_Instances()
	{
		var colors = Color.Instances;

		this.Blue = new NetworkNodeDefn("Blue", colors.GrayLight);
		this.Green = new NetworkNodeDefn("Green", colors.GrayLight);
		this.Red = new NetworkNodeDefn("Red", colors.GrayLight);

		this._All = 
		[
			this.Blue,
			this.Green,
			this.Red,			
		];
	}

	NetworkNodeDefn.Instances = new NetworkNodeDefn_Instances();
}
