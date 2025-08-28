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
    finalizeIsComplete() { return true; }
    initialize(universe) {
        this.venueControls = new VenueControls(this.researchSession.toControl(universe, universe.display.sizeInPixels), null);
    }
    initializeIsComplete() { return true; }
    updateForTimerTick(universe) {
        this.venueControls.updateForTimerTick(universe);
    }
}
