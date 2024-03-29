
class PlanetDemographics
{
	population: number;

	constructor(population: number)
	{
		this.population = population;
	}

	notificationsForRoundAddToArray(notificationsSoFar: Notification2[]): Notification2[]
	{
		return notificationsSoFar; // todo
	}

	populationIdle(universe: Universe, planet: Planet): number
	{
		var populationCurrent = this.population;
		var populationOccupied = this.populationOccupied(universe, planet);
		var populationIdle = populationCurrent - populationOccupied;
		return populationIdle;
	}

	populationAdd(universe: Universe, planet: Planet, amountToAdd: number): number
	{
		var populationIdleBefore = this.populationIdle(universe, planet);

		this.population += amountToAdd;

		var populationIdleAfter = this.populationIdle(universe, planet);
		
		var populationIdleNet =
			populationIdleAfter - populationIdleBefore;
		
		if (populationIdleNet == 1)
		{
			var buildableInProgress = planet.buildableInProgress(universe);
			if (buildableInProgress == null)
			{
				var notification = new Notification2
				(
					"Planet " + planet.name + " now has free population.",
					() => planet.jumpTo(universe)
				);
				var faction = (universe.world as WorldExtended).factionCurrent();
				faction.notificationAdd(notification);
			}
		}

		return this.population;
	}

	populationOccupied(universe: Universe, planet: Planet): number
	{
		var layout = planet.layout(universe);
		var facilities = layout.facilities();
		var facilitiesAutomated = facilities.filter(x => Buildable.ofEntity(x).isAutomated);
		var returnValue = facilities.length - facilitiesAutomated.length;
		return returnValue;
	}

	prosperityAccumulated(planet: Planet): Resource
	{
		var resourcesAccumulated = planet.resourcesAccumulated;
		var prosperityAccumulated =
			resourcesAccumulated.find(x => x.defnName == "Prosperity");
		return prosperityAccumulated;
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
		var prosperityAccumulated = this.prosperityAccumulated(planet);

		var prosperityThisRoundNet = planet.prosperityThisRound(universe, world, faction);

		prosperityAccumulated.addQuantity(prosperityThisRoundNet);

		var quantityToGrow = this.prosperityNeededToGrow();

		if (prosperityAccumulated.quantity >= quantityToGrow)
		{
			prosperityAccumulated.clear();
			planet.populationIncrement(universe);
		}
	}
}
