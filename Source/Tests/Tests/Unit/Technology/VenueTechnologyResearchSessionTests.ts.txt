
class VenueTechnologyResearchSession implements Venue
{
	researchSession: TechnologyResearchSession;

	venueControls: VenueControls;

	constructor(researchSession: TechnologyResearchSession)
	{
		this.researchSession = researchSession;
	}

	draw(universe: Universe)
	{
		this.venueControls.draw(universe);
	}

	finalize(universe: Universe)
	{
		// Do nothing.
	}

	initialize(universe: Universe)
	{
		this.venueControls = new VenueControls
		(
			this.researchSession.toControl(universe), null
		);
	}

	updateForTimerTick(universe: Universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}
}
