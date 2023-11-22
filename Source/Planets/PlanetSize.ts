
class PlanetSize
{
	name: string;
	radiusInPixels: number;
	surfaceSizeInCells: Coords;

	constructor(name: string, radiusInPixels: number, surfaceSizeInCells: Coords)
	{
		this.name = name;
		this.radiusInPixels = radiusInPixels;
		this.surfaceSizeInCells = surfaceSizeInCells;
	}

	static byName(name: string): PlanetSize
	{
		return PlanetSize.Instances().byName(name);
	}

	static _instances: PlanetSize_Instances;
	static Instances(): PlanetSize_Instances
	{
		if (PlanetSize._instances == null)
		{
			PlanetSize._instances = new PlanetSize_Instances();
		}
		return PlanetSize._instances;
	}
}

class PlanetSize_Instances
{
	Default: PlanetSize;

	Tiny: PlanetSize;
	Small: PlanetSize;
	Medium: PlanetSize;
	Large: PlanetSize;
	Giant: PlanetSize;

	_All: PlanetSize[];

	constructor()
	{
		var ps = (name: string, dimension: number) =>
		{
			var radiusInPixels = Math.floor(4 * Math.sqrt(dimension));

			var surfaceSizeInCells = Coords.ones().multiplyScalar(dimension);

			return new PlanetSize
			(
				name,
				radiusInPixels,
				surfaceSizeInCells
			);
		}

		this.Tiny 		= ps("Tiny", 3 );
		this.Small 		= ps("Small", 4 );
		this.Medium 	= ps("Medium", 5 );
		this.Large 		= ps("Large", 6 );
		this.Giant 	= ps("Giant", 7 );

		this.Default = this.Medium;

		this._All =
		[
			this.Default,

			this.Tiny,
			this.Small,
			this.Medium,
			this.Large,
			this.Giant
		];
	}

	byName(name: string): PlanetSize
	{
		return this._All.find(x => x.name == name);
	}
}