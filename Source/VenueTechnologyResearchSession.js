
function VenueTechnologyResearchSession(researchSession)
{
	this.researchSession = researchSession;

	this.venueControls = new VenueControls
	(
		this.researchSession.controlBuild
		(
			Globals.Instance.display.sizeInPixels
		)
	);
}

{
	VenueTechnologyResearchSession.prototype.draw = function()
	{
		this.venueControls.draw();
	}

	VenueTechnologyResearchSession.prototype.initialize = function()
	{
		// do nothing
	}

	VenueTechnologyResearchSession.prototype.updateForTimerTick = function()
	{
		this.venueControls.updateForTimerTick();
	}
}
