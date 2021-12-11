"use strict";
class VenueTechnologyResearchSession {
    constructor(researchSession) {
        this.researchSession = researchSession;
    }
    draw(universe) {
        this.venueControls.draw(universe);
    }
    finalize(universe) {
        // Do nothing.
    }
    initialize(universe) {
        this.venueControls = new VenueControls(this.researchSession.toControl(universe, universe.display.sizeInPixels), null);
    }
    updateForTimerTick(universe) {
        this.venueControls.updateForTimerTick(universe);
    }
}
