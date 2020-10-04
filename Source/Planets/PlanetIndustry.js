
class PlanetIndustry
{
	updateForTurn(universe, world, faction, planet)
	{
		planet._resourcesPerTurn = null;

		var resourcesAccumulated = planet.resourcesAccumulated;
		var resourcesProduced = planet.resourcesPerTurn(universe, world, faction);
		Resource.add(resourcesAccumulated, resourcesProduced);

		var buildableInProgress = planet.buildableInProgress();
		if (buildableInProgress == null)
		{
			var notification = new Notification("Default", world.turnsSoFar, "Nothing being built.", planet);
			faction.notificationSession.notifications.push(notification);
		}
		else
		{
			var buildableDefn = buildableInProgress.defn(world);
			var resourcesToBuild = buildableDefn.resourcesToBuild;
			if (Resource.isSupersetOf(resourcesAccumulated, resourcesToBuild) == true)
			{
				Resource.subtract(resourcesAccumulated, resourcesToBuild);
				buildableInProgress.isComplete = true;
				buildableInProgress._visual = null;
			}
		}
	}
}
