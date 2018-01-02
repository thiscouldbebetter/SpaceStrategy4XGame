
function PlanetIndustry()
{}

{
	PlanetIndustry.prototype.updateForTurn = function(universe, world, faction, planet)
	{
		var layout = planet.layout;

		var resourcesAccumulated = layout.resourcesAccumulated;		
		var resourcesProduced = planet.resourcesPerTurn(universe, world, faction);
		Resource.add(resourcesAccumulated, resourcesProduced);
		
		var buildableInProgress = layout.buildableInProgress();
		if (buildableInProgress == null)
		{
			var notification = new Notification("Default", 0, "Nothing being built.", planet);
			faction.notificationSession.notifications.push(notification);
		}
		else
		{
			var buildableDefn = buildableInProgress.defn(world);
			var resourcesToBuild = buildableDefn.resourcesToBuild;
			if (Resource.greaterThanOrEqualTo(resourcesAccumulated, resourcesToBuild) == true)
			{
				Resource.subtract(resourcesAccumulated, resourcesToBuild);
				buildableInProgress.isComplete = true;
				buildableInProgress._visual = null;
			}
		}
	}
}
