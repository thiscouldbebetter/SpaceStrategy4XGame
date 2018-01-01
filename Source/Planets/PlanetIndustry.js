
function PlanetIndustry()
{}

{
	PlanetIndustry.prototype.updateForTurn = function(universe, world, faction, planet)
	{
		var industryThisTurn = planet.industryPerTurn(universe, world, faction);
		var layout = planet.layout;
		var buildableInProgress = layout.buildableInProgress();
		if (buildableInProgress == null)
		{
			var notification = new Notification("Default", 0, "Nothing being built.", planet);
			faction.notificationSession.notifications.push(notification);
		}
		else
		{
			var buildableDefn = buildableInProgress.defn(world);
			buildableInProgress.industrySoFar += industryThisTurn;
			if (buildableInProgress.industrySoFar >= buildableDefn.industryToBuild)
			{
				buildableInProgress.industrySoFar = null;
			}
		}
	}
}
