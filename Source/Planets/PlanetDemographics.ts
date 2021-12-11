
class PlanetDemographics
{
	population: number;

	constructor(population: number)
	{
		this.population = population;
	}

	toStringDescription(): string
	{
		return "Population " + this.population;
	}

	updateForTurn(universe: Universe, world: World, faction: Faction, planet: Planet): void
	{
		// todo
	}
}
