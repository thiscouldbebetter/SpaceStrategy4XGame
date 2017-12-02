
function PlanetIndustry(industryAccumulated, buildableInProgress)
{
	this.industryAccumulated = industryAccumulated;
	this._buildableInProgress = buildableInProgress;
}

{
	PlanetIndustry.prototype.buildableInProgress = function(planet, valueToSet)
	{
		if (valueToSet == null)
		{
			return this._buildableInProgress;
		}
		else
		{
			this._buildableInProgress = valueToSet;
			planet.layout.map.cursor.bodyDefn = valueToSet; // hack
		}

		return this._buildableInProgress;
	}

	PlanetIndustry.prototype.updateForTurn = function(universe, faction, planet)
	{
		var industryThisTurn = planet.industryPerTurn(universe, faction);
		this.industryAccumulated += industryThisTurn;
		var buildableInProgress = this.buildableInProgress();
		if (buildableInProgress != null)
		{
			var buildableDefn = buildableInProgress.defn;
			var industryToComplete = buildableDefn.industryToComplete;
			if (this.industryAccumulated >= industryToComplete)
			{
				this.industryAccumulated -= industryToComplete;
			}
		}
	}
}
