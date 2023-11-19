
class PlanetEnvironment
{
	name: string;
	relativeProportionsOfCellsWithColorsWRGBK: number[];

	constructor
	(
		name: string,
		relativeProportionsOfCellsWithColorsWRGBK: number[]
	)
	{
		this.name = name;
		this.relativeProportionsOfCellsWithColorsWRGBK = relativeProportionsOfCellsWithColorsWRGBK;
	}

	static byName(name: string): PlanetEnvironment
	{
		return PlanetEnvironment.Instances().byName(name);
	}

	static _instances: PlanetEnvironment_Instances;
	static Instances(): PlanetEnvironment_Instances
	{
		if (PlanetEnvironment._instances == null)
		{
			PlanetEnvironment._instances = new PlanetEnvironment_Instances();
		}
		return PlanetEnvironment._instances;
	}
}

class PlanetEnvironment_Instances
{
	Default: PlanetEnvironment;

	Husk: PlanetEnvironment;
	Primordial: PlanetEnvironment;
	Congenial: PlanetEnvironment;
	Eden: PlanetEnvironment;
	Mineral: PlanetEnvironment;
	Supermineral: PlanetEnvironment;
	Chapel: PlanetEnvironment;
	Cathedral: PlanetEnvironment;
	Special: PlanetEnvironment;
	Tycoon: PlanetEnvironment;
	Cornucopia: PlanetEnvironment;

	_All: PlanetEnvironment[];

	constructor()
	{
		var pe = (n: string, w: number, r: number, g: number, b: number, k: number) =>
			new PlanetEnvironment(n, [ w, r, g, b, k ]);

		this.Default = pe("Default", 1, 0, 0, 0, 0 );

												// 	w, r, g, b, k
		this.Husk 			= pe("Husk", 			0, 0, 0, 0, 100 );
		this.Primordial 	= pe("Primordial", 		50, 44, 2, 2, 2 );
		this.Congenial 		= pe("Congenial", 		20, 69, 3, 5, 3 );
		this.Eden 			= pe("Eden", 			0, 74, 3, 20, 3 );
		this.Mineral		= pe("Mineral", 		40, 46, 10, 2, 2 );
		this.Supermineral	= pe("Supermineral", 	20, 56, 20, 2, 2 );
		this.Chapel			= pe("Chapel",			40, 46, 2, 2, 10 );
		this.Cathedral 		= pe("Cathedral",		20, 54, 3, 3, 20 );
		this.Special 		= pe("Special", 		40, 30, 10, 10, 10);
		this.Tycoon 		= pe("Tycoon", 			20, 35, 15, 15, 15);
		this.Cornucopia 	= pe("Cornucopia", 		0, 0, 33, 33, 33);

		this._All =
		[
			this.Default,
			this.Husk,
			this.Primordial,
			this.Congenial,
			this.Eden,
			this.Mineral,
			this.Supermineral,
			this.Chapel,
			this.Cathedral,
			this.Special,
			this.Tycoon,
			this.Cornucopia
		];
	}

	byName(name: string): PlanetEnvironment
	{
		return this._All.find(x => x.name == name);
	}
}