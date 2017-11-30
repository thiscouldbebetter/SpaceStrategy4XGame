
function PlanetIndustry(industryAccumulated, buildableInProgress)
{
	this.industryAccumulated = industryAccumulated;
	this.buildableInProgress = buildableInProgress;
}

{
	PlanetIndustry.prototype.updateForTurn = function(planet)
	{
		var industryThisTurn = 1; // hack
		this.industryAccumulated += industryThisTurn;
		if (this.buildableInProgress != null)
		{
			var buildableDefn = this.buildableInProgress.defn;
			var industryToComplete = buildableDefn.industryToComplete;
			if (this.industryAccumulated >= industryToComplete)
			{
				this.industryAccumulated = 0;
				// todo
				var one = 1;
			}
		}
	}
}
