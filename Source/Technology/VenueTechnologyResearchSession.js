
class VenueTechnologyResearchSession
{
	constructor(researchSession)
	{
		this.researchSession = researchSession;
	}

	draw(universe)
	{
		this.venueControls.draw(universe);
	}

	initialize(universe)
	{
		this.venueControls = new VenueControls
		(
			this.researchSession.controlBuild(universe)
		);
	}

	updateForTimerTick(universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}
}
