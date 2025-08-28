"use strict";
class VisualElevationStem {
    constructor() {
        // Helper variables.
        this.drawPosTip = Coords.create();
        this.drawPosPlane = Coords.create();
    }
    draw(uwpe, display) {
        var universe = uwpe.universe;
        var starsystem = universe.venueCurrent().starsystem;
        if (starsystem == null) {
            return;
        }
        var camera = starsystem.camera2(universe);
        var entity = uwpe.entity;
        var drawablePosWorld = Locatable.of(entity).loc.pos;
        var drawPosTip = camera.coordsTransformWorldToView(this.drawPosTip.overwriteWith(drawablePosWorld));
        var drawPosPlane = camera.coordsTransformWorldToView(this.drawPosPlane.overwriteWith(drawablePosWorld).clearZ());
        var colorName = (drawablePosWorld.z < 0 ? "Green" : "Red");
        display.drawLine(drawPosTip, drawPosPlane, Color.byName(colorName), null);
    }
    initialize(uwpe) { }
    initializeIsComplete() { return true; }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Transformable.
    transform(transform) { return this; }
}
