
class PlanetIndustry
{
	buildablesAreChosenAutomatically: boolean;

	constructor()
	{
		this.buildablesAreChosenAutomatically = false;
	}

	buildableChooseAutomatically
	(
		universe: Universe,
		world: World,
		planet: Planet
	): void
	{
		var planetAsPlace = planet.toPlace();
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, planetAsPlace, null, null
		);
		var intelligenceComputer = FactionIntelligence.Instances().Computer;
		intelligenceComputer.planetBuildableChoose(uwpe);
	}

	notificationsForRoundAddToArray
	(
		universe: Universe,
		world: WorldExtended,
		planet: Planet,
		notificationsSoFar: Notification2[]
	): Notification2[]
	{
		var buildableEntityInProgress =
			planet.buildableEntityInProgress(universe);

		if (buildableEntityInProgress == null)
		{
			var hasIdlePopulation = planet.populationIdleExists(universe);

			if (hasIdlePopulation)
			{
				if (this.buildablesAreChosenAutomatically)
				{
					this.buildableChooseAutomatically(universe, world, planet);
				}
				else
				{
					var message =
						"Planet " + planet.name
						+ " has free population, but nothing is being built.";

					var notification = new Notification2
					(
						message,
						() => planet.jumpTo(universe)
					);
					notificationsSoFar.push(notification);
				}
			}
		}

		return notificationsSoFar;
	}

	planetIndustryAccumulatedClear(planet: Planet): void
	{
		this.planetIndustryAccumulated(planet).quantity = 0;
	}

	planetIndustryAccumulated(planet: Planet): Resource
	{
		return planet.resourcesAccumulated.find(x => x.defnName == "Industry");
	}

	toStringDescription(universe: Universe, world: WorldExtended, planet: Planet): string
	{
		var buildableEntityInProgress =
			planet.buildableEntityInProgress(universe);

		var buildableString = "building ";

		if (buildableEntityInProgress == null)
		{
			buildableString += "nothing";
		}
		else
		{
			var buildableInProgress =
				Buildable.ofEntity(buildableEntityInProgress);
			var buildableDefn = buildableInProgress.defn;
			var industryToBuild = buildableDefn.industryToBuild;

			var industryAccumulated =
				this.planetIndustryAccumulated(planet).quantity;

			var resourcesAccumulatedOverNeeded =
				industryAccumulated + "/" + industryToBuild;

			buildableString +=
				buildableDefn.name
				+ "(" + resourcesAccumulatedOverNeeded + ")";
		}

		var returnValue = buildableString;

		return returnValue;
	}

	updateForRound
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		planet: Planet
	): void
	{
		var buildableEntityInProgress =
			planet.buildableEntityInProgress(universe);

		if (buildableEntityInProgress != null)
		{
			var industryAccumulated = this.planetIndustryAccumulated(planet);
			var industryProducedQuantity = planet.industryThisRound(universe, world);
			industryAccumulated.addQuantity(industryProducedQuantity);

			var buildableInProgress =
				Buildable.ofEntity(buildableEntityInProgress);
			var buildableDefn = buildableInProgress.defn;
			var industryToBuild = buildableDefn.industryToBuild;
			if (industryAccumulated.quantity >= industryToBuild)
			{
				industryAccumulated.clear();
				buildableInProgress.isComplete = true;
				buildableInProgress._visual = null;

				var buildableAsItem = buildableEntityInProgress.item();
				if (buildableAsItem != null)
				{
					planet.itemHolder().itemAdd(buildableAsItem);
				}

				planet.resourcesThisRoundReset();

				var intelligenceComputer = FactionIntelligence.Instances().Computer;

				var buildablesAreChosenAutomatically =
					this.buildablesAreChosenAutomatically
					|| faction.intelligence == intelligenceComputer;

				if (buildablesAreChosenAutomatically)
				{
					this.buildableChooseAutomatically(universe, world, planet);
				}
				else
				{
					var populationIdle = planet.populationIdle(universe);
					var notificationText =
						"Planet " + planet.name + " is done building " + buildableDefn.name + ", "
						+ (populationIdle > 0 ? "and" : "but")
						+ " has " + populationIdle + " free population.";
					var notification = new Notification2
					(
						notificationText, () => planet.jumpTo(universe)
					);
					faction.notificationAdd(notification);
				}
			}
		}
	}
}
