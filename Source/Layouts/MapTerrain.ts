
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

	private static _instances: MapTerrain_Instances;
	static Instances(cellSizeInPixels: Coords): MapTerrain_Instances
	{
		if (MapTerrain._instances == null)
		{
			MapTerrain._instances = new MapTerrain_Instances(cellSizeInPixels);
		}
		return MapTerrain._instances;
	}
	
	static planet(cellSizeInPixels: Coords): MapTerrain[]
	{
		return MapTerrain.Instances(cellSizeInPixels)._Planet;
	}

	isSurface(): boolean
	{
		return MapTerrain.Instances(null).isTerrainSurface(this);
	}
}

class MapTerrain_Instances
{
	None: MapTerrain;

	Orbit: MapTerrain;

	Ship: MapTerrain;

	SurfaceDefault: MapTerrain;
	SurfaceIndustry: MapTerrain;
	SurfaceProsperity: MapTerrain;
	SurfaceResearch: MapTerrain;
	SurfaceUnusable: MapTerrain;

	_Planet: MapTerrain[];
	_Surface: MapTerrain[];

	_All: MapTerrain[];

	constructor(cellSizeInPixels: Coords)
	{
		var visualFromColor = (color: Color) =>
			VisualRectangle.fromSizeAndColorBorder(cellSizeInPixels.clone().half(), color);

		var colors = Color.Instances();

		var mt = (name: string, codeChar: string, color: Color) =>
			new MapTerrain(name, codeChar, visualFromColor(color) );

		this.None 					= mt("None", " ", colors._Transparent);
		this.Orbit 					= mt("Orbit", "-", colors.Violet);
		this.Ship 					= mt("Ship", "#", colors.Violet);
		this.SurfaceDefault 		= mt("White", ".", colors.White);
		this.SurfaceIndustry 		= mt("Red", "r", colors.Red);
		this.SurfaceProsperity 		= mt("Green", "p", colors.Green);
		this.SurfaceResearch 		= mt("Blue", "b", colors.Blue);
		this.SurfaceUnusable 		= mt("Black", "k", colors.GrayDark);

		this._Planet =
		[
			this.None,
			this.Orbit,
			this.SurfaceDefault,
			this.SurfaceIndustry,
			this.SurfaceProsperity,
			this.SurfaceResearch,
			this.SurfaceUnusable
		];

		this._Surface =
		[
			this.SurfaceDefault,
			this.SurfaceIndustry,
			this.SurfaceProsperity,
			this.SurfaceResearch,
			this.SurfaceUnusable
		];

		this._All =
		[
			this.None,
			this.Orbit,
			this.Ship,
			this.SurfaceDefault,
			this.SurfaceIndustry,
			this.SurfaceProsperity,
			this.SurfaceResearch,
			this.SurfaceUnusable
		];
	}
	
	isTerrainSurface(terrainToCheck: MapTerrain): boolean
	{
		return (this._Surface.indexOf(terrainToCheck) >= 0);
	}

}
