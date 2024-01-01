"use strict";
class Cursor extends Entity {
    constructor() {
        super(Cursor.name, [
            new Constrainable([
                new Constraint_Cursor()
            ]),
            Locatable.fromPos(Coords.create())
        ]);
        this.propertyAdd(this.bodyDefn());
        this.entityUsingCursorToTarget = null;
        this.entityUnderneath = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
        this.defn = this.bodyDefn();
    }
    bodyDefn() {
        var radius = 5;
        var color = Color.Instances().White;
        var visualCrosshairs = new VisualGroup([
            VisualCircle.fromRadiusAndColors(radius, null, color),
            new VisualLine(Coords.fromXY(-radius, 0), Coords.fromXY(radius, 0), color, null),
            new VisualLine(Coords.fromXY(0, -radius), Coords.fromXY(0, radius), color, null),
        ]);
        var visualReticle = new VisualSelect(new Map([
            ["None", new VisualNone()],
            ["Crosshairs", visualCrosshairs]
        ]), 
        // selectChildNames
        (uwpe, display) => {
            var returnValue;
            var cursor = uwpe.entity;
            if (cursor.entityUsingCursorToTarget == null) {
                returnValue = "None";
            }
            else {
                returnValue = "Crosshairs";
            }
            return [returnValue];
        });
        var visualHover = new VisualText(DataBinding.fromContextAndGet(UniverseWorldPlaceEntities.create(), // hack - See VisualText.draw().
        (uwpe) => {
            var returnValue;
            var venue = uwpe.universe.venueCurrent();
            var c = venue.cursor;
            if (c == null) {
                returnValue = "";
            }
            else {
                var world = uwpe.world;
                if (c.entityUnderneath == null) {
                    returnValue = "";
                }
                else if (c.entityUnderneath.constructor.name == LinkPortal.name) {
                    var linkPortal = c.entityUnderneath;
                    returnValue =
                        linkPortal.nameAccordingToFactionPlayerKnowledge(world);
                }
                else {
                    returnValue = c.entityUnderneath.name;
                }
            }
            return returnValue;
        }), null, // heightInPixels
        Color.byName("Gray"), Color.byName("White"));
        var visual = new VisualGroup([
            visualHover,
            visualReticle
        ]);
        var bodyDefn = new BodyDefn("Cursor", Coords.fromXY(1, 1).multiplyScalar(radius * 2), // size
        visual);
        return bodyDefn;
    }
    clear() {
        this.entityUsingCursorToTarget = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
    }
    // drawable
    draw(uwpe, display) {
        var universe = uwpe.universe;
        var venue = universe.venueCurrent();
        var venueTypeName = venue.constructor.name;
        if (venueTypeName == VenueFader.name) {
            venue = venue.venueCurrent();
        }
        var venueStarsystem = venue;
        var starsystem = venueStarsystem.starsystem;
        starsystem.draw_Body(uwpe, display);
    }
}
