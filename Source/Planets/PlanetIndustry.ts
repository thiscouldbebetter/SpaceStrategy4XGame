
class PlanetIndustry
{
	updateForTurn
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		planet: Planet
	): void
	{
		var resourcesAccumulated = planet.resourcesAccumulated;
		var resourcesProduced = planet.resourcesPerTurn(universe, world, faction);
		Resource.add(resourcesAccumulated, resourcesProduced);

		var buildableEntityInProgress = planet.buildableEntityInProgress();
		if (buildableEntityInProgress == null)
		{
			var notification = new Notification2
			(
				"Default", world.turnsSoFar, "Nothing being built.", planet.name
			);
			faction.notificationSession.notificationAdd(notification);
		}
		else
		{
			var buildableInProgress =
				Buildable.fromEntity(buildableEntityInProgress);
			var buildableDefn = buildableInProgress.defn(world);
			var resourcesToBuild = buildableDefn.resourcesToBuild;
			if (Resource.isSupersetOf(resourcesAccumulated, resourcesToBuild))
			{
				Resource.subtract(resourcesAccumulated, resourcesToBuild);
				buildableInProgress.isComplete = true;
				buildableInProgress._visual = null;

				var buildableAsItem = buildableEntityInProgress.item();
				if (buildableAsItem != null)
				{
					planet.itemHolder().itemAdd(buildableAsItem);
				}
			}
		}
	}
}
