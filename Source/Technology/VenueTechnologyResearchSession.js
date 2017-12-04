
function VenueTechnologyResearchSession(researchSession)
{
	this.researchSession = researchSession;
}

{
	VenueTechnologyResearchSession.prototype.draw = function(universe)
	{
		this.venueControls.draw(universe);
	}

	VenueTechnologyResearchSession.prototype.initialize = function(universe)
	{
		this.venueControls = new VenueControls
		(
			this.researchSession.controlBuild(universe)
		);
	}

	VenueTechnologyResearchSession.prototype.updateForTimerTick = function(universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}
}
