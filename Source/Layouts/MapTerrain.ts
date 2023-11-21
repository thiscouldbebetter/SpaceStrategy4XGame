
class MapTerrain
{
	name: string;
	codeChar: string;
	visual: VisualBase;

	constructor
	(
		name: string, codeChar: string, visual: VisualBase
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.visual = visual;
	}

	static planet(cellSizeInPixels: Coords): MapTerrain[]
	{
		var visualFromColor = (color: Color) =>
			VisualRectangle.fromSizeAndColorBorder(cellSizeInPixels.clone().half(), color);

		var colors = Color.Instances();

		var terrains =
		[
			new MapTerrain
			(
				"None",
				" ",
				visualFromColor(colors._Transparent)
			),
			new MapTerrain
			(
				"Orbit",
				"-",
				visualFromColor(colors.Violet)
			),
			new MapTerrain
			(
				"Surface",
				".",
				visualFromColor(colors.GrayLight)
			),
		];

		return terrains;
	}

}
