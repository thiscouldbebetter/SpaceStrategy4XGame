
class PlanetDemographics
{
	population: number;

	constructor(population: number)
	{
		this.population = population;
	}

	populationIncrement(): number
	{
		this.population++;
		return this.population;
	}
	
	prosperityNeededToGrow(): number
	{
		return this.population * 30;
	}

	toStringDescription(): string
	{
		return "Population " + this.population;
	}

	updateForRound
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		planet: Planet
	): void
	{
		var resourcesAccumulated = planet.resourcesAccumulated;
		var prosperityAccumulated =
			resourcesAccumulated.find(x => x.defnName == "Prosperity");

		var prosperityThisTurnNet = planet.prosperityPerTurn(universe, world, faction);

		prosperityAccumulated.addQuantity(prosperityThisTurnNet);

		var quantityToGrow = this.prosperityNeededToGrow();

		if (prosperityAccumulated.quantity >= quantityToGrow)
		{
			prosperityAccumulated.clear();
			planet.populationIncrement();
		}
	}
}
