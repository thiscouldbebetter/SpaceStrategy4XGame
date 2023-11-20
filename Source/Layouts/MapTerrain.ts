
class MapTerrain
{
	name: string;
	codeChar: string;
	visual: VisualBase;
	isBlocked: boolean;

	constructor
	(
		name: string, codeChar: string, visual: VisualBase, isBlocked: boolean
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.visual = visual;
		this.isBlocked = isBlocked;
	}

	static planet(cellSizeInPixels: Coords): MapTerrain[]
	{
		var visualFromColor = (color: Color) =>
			new VisualRectangle(cellSizeInPixels, null, color, null);

		var colors = Color.Instances();

		var terrains =
		[
			new MapTerrain
			(
				"None",
				" ",
				visualFromColor(colors._Transparent),
				false // isBlocked
			),
			new MapTerrain
			(
				"Orbit",
				"-",
				visualFromColor(colors.Violet),
				false
			),
			new MapTerrain
			(
				"Surface",
				".",
				visualFromColor(colors.GrayLight),
				false
			),
		];

		return terrains;
	}

}
