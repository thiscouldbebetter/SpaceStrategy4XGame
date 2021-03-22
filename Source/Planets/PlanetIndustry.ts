
class PlanetIndustry
{
	updateForTurn(universe: Universe, world: WorldExtended, faction: Faction, planet: Planet)
	{
		var resourcesAccumulated = planet.resourcesAccumulated;
		var resourcesProduced = planet.resourcesPerTurn(universe, world, faction);
		Resource.add(resourcesAccumulated, resourcesProduced);

		var buildableInProgress = planet.buildableInProgress();
		if (buildableInProgress == null)
		{
			var notification = new Notification2
			(
				"Default", world.turnsSoFar, "Nothing being built.", planet.name
			);
			faction.notificationSession.notificationAdd(notification);
		}
		else
		{
			var buildableDefn = buildableInProgress.defn(world);
			var resourcesToBuild = buildableDefn.resourcesToBuild;
			if (Resource.isSupersetOf(resourcesAccumulated, resourcesToBuild))
			{
				Resource.subtract(resourcesAccumulated, resourcesToBuild);
				buildableInProgress.isComplete = true;
				buildableInProgress._visual = null;
			}
		}
	}
}
