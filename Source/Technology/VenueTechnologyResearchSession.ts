
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

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe)
	{
		this.venueControls = new VenueControls
		(
			this.researchSession.toControl
			(
				universe, universe.display.sizeInPixels
			), null
		);
	}

	initializeIsComplete(): boolean { return true; }

	updateForTimerTick(universe: Universe)
	{
		this.venueControls.updateForTimerTick(universe);
	}
}
