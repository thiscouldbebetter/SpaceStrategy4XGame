
class PlanetType
{
	size: PlanetSize;
	environment: PlanetEnvironment;

	constructor(size: PlanetSize, environment: PlanetEnvironment)
	{
		this.size = size;
		this.environment = environment;
	}

	static byName(name: string): PlanetType
	{
		return PlanetType.Instances().byName(name);
	}

	static _instances: PlanetType_Instances;
	static Instances(): PlanetType_Instances
	{
		if (PlanetType._instances == null)
		{
			PlanetType._instances = new PlanetType_Instances();
		}
		return PlanetType._instances;
	}

	name(): string
	{
		return this.size.name + " " + this.environment.name;
	}
}

class PlanetType_Instances
{
	Default: PlanetType;

	_All: PlanetType[];

	constructor()
	{
		var pt = (size: PlanetSize, environment: PlanetEnvironment) =>
			new PlanetType(size, environment);

		var sizes = PlanetSize.Instances();
		var environments = PlanetEnvironment.Instances();

		this.Default = pt(sizes.Medium, environments.Default);

		this._All =
		[
			this.Default,
		];
	}

	byName(name: string): PlanetType
	{
		return this._All.find(x => x.name() == name);
	}
}