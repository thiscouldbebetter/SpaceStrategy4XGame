
function VenueTechnologyResearchSession(universe, researchSession)
{
	this.researchSession = researchSession;

	this.venueControls = new VenueControls
	(
		this.researchSession.controlBuild
		(
			universe.display.sizeInPixels
		)
	);
}

{
	VenueTechnologyResearchSession.prototype.draw = function(universe)
	{
		this.venueControls.draw(universe);
	}

	VenueTechnologyResearchSession.prototype.initialize = function()
	{
		// do nothing
	}

	VenueTechnologyResearchSession.prototype.updateForTimerTick = function(universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}
}
