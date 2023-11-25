
class PlanetIndustry
{
	planetIndustryAccumulatedClear(planet: Planet): void
	{
		planet.resourcesAccumulated.find(x => x.defnName == "Industry").quantity = 0;
	}

	planetIndustryAccumulated(planet: Planet): number
	{
		return planet.resourcesAccumulated.find(x => x.defnName == "Industry").quantity;
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
			var buildableDefn = buildableInProgress.defn(world);
			var industryToBuild = buildableDefn.industryToBuild;

			var industryAccumulated = this.planetIndustryAccumulated(planet);

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
		var resourcesAccumulated = planet.resourcesAccumulated;
		var industryAccumulated = resourcesAccumulated.find(x => x.defnName == "Industry");
		var industryProduced = planet.industryPerTurn(universe, world);
		industryAccumulated.addQuantity(industryProduced);

		var buildableEntityInProgress =
			planet.buildableEntityInProgress(universe);

		if (buildableEntityInProgress == null)
		{
			var hasIdlePopulation = planet.populationIdleExists(universe);
			if (hasIdlePopulation)
			{
				var notification = new Notification2
				(
					"Default", world.roundNumberCurrent(), "Planet has free population, but nothing is being built.", planet
				);
				faction.notificationSession.notificationAdd(notification);
			}
		}
		else
		{
			var buildableInProgress =
				Buildable.ofEntity(buildableEntityInProgress);
			var buildableDefn = buildableInProgress.defn(world);
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

				var notificationText = "Planet " + planet.name + " is done building " + buildableDefn.name + ".";
				var notification = new Notification2
				(
					"Default", world.roundNumberCurrent(), notificationText, planet
				);
				faction.notificationSession.notificationAdd(notification);
			}
		}
	}
}
