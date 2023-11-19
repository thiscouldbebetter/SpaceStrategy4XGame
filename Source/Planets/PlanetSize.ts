
class PlanetSize
{
	name: string;
	sizeInCells: Coords;

	constructor(name: string, sizeInCells: Coords)
	{
		this.name = name;
		this.sizeInCells = sizeInCells;
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
	Enormous: PlanetSize;

	_All: PlanetSize[];

	constructor()
	{
		var ps = (name: string, dimension: number) =>
			new PlanetSize(name, Coords.ones().multiplyScalar(dimension) );

		this.Tiny 		= ps("Tiny", 1 );
		this.Small 		= ps("Small", 2 );
		this.Medium 	= ps("Medium", 3 );
		this.Large 		= ps("Large", 4 );
		this.Enormous 	= ps("Enormous", 5 );

		this.Default = this.Medium;

		this._All =
		[
			this.Default,

			this.Tiny,
			this.Small,
			this.Medium,
			this.Large,
			this.Enormous
		];
	}

	byName(name: string): PlanetSize
	{
		return this._All.find(x => x.name == name);
	}
}