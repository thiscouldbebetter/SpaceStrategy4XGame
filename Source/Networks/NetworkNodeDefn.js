
function NetworkNodeDefn(name, colorName)
{
	this.name = name;
	this.colorName = colorName;
}

{
	NetworkNodeDefn.Instances = new NetworkNodeDefn_Instances();	
	
	function NetworkNodeDefn_Instances()
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
