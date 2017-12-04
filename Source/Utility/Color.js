
function Color(name, systemColor)
{
	this.name = name;
	this.systemColor = systemColor;
}

{
	Color.Instances = function()
	{
		if (Color._instances == null)
		{
			Color._instances = new Color_Instances();
		}
		return Color._instances;
	}

	function Color_Instances()
	{
		this.Black = new Color("Black", "rgb(0, 0, 0)");
		this.Blue = new Color("Blue", "rgb(0, 0, 255)");
		this.Brown = new Color("Brown", "Brown");
		this.Cyan = new Color("Cyan", "rgb(0, 255, 255)");
		this.CyanHalfTranslucent = new Color("CyanHalfTranslucent", "rgba(0, 128, 128, .5)");
		this.Gray = new Color("Gray", "rgb(128, 128, 128)");
		this.GrayLight = new Color("Gray", "rgb(224, 224, 224)");
		this.Green = new Color("Green", "rgb(0, 255, 0)");
		this.Orange = new Color("Orange", "Orange");
		this.Red = new Color("Red", "rgb(255, 0, 0)");
		this.Violet = new Color("Violet", "Violet");
		this.Yellow = new Color("Yellow", "rgb(255, 255, 0)");
		this.YellowDark = new Color("YellowDark", "rgb(192, 192, 0)");
		this.White = new Color("White", "rgb(255, 255, 255)");
	}
}
