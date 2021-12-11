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
        this.entityUnderneath = null;
        this.entityParent = null;
        this.orderName = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
        this.defn = this.bodyDefn();
    }
    bodyDefn() {
        var radius = 5;
        var color = Color.Instances().White;
        var visualReticle = new VisualSelect(new Map([
            ["None", new VisualNone()],
            [
                "Crosshairs",
                new VisualGroup([
                    new VisualCircle(radius, null, color, null),
                    new VisualLine(Coords.fromXY(-radius, 0), Coords.fromXY(radius, 0), color, null),
                    new VisualLine(Coords.fromXY(0, -radius), Coords.fromXY(0, radius), color, null),
                ])
            ]
        ]), 
        // selectChildNames
        (uwpe, display) => {
            var returnValue;
            var cursor = uwpe.entity;
            if (cursor.entityParent == null) {
                returnValue = "None";
            }
            else {
                returnValue = "Crosshairs";
            }
            return [returnValue];
        });
        var visualHover = new VisualText(DataBinding.fromContextAndGet(this, (c) => {
            var returnValue;
            if (c.entityUnderneath == null) {
                returnValue = "";
            }
            else {
                returnValue = c.entityUnderneath.name;
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
        this.entityParent = null;
        this.orderName = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
    }
    entityAndOrderNameSet(entity, orderName) {
        this.entityParent = entity;
        this.orderName = orderName;
        return this;
    }
    // controls
    toControl(uwpe, size) {
        return this.entityParent.controllable().toControl(uwpe, size, null);
    }
    // drawable
    draw(uwpe, display) {
        var universe = uwpe.universe;
        var venue = universe.venueCurrent;
        var venueTypeName = venue.constructor.name;
        if (venueTypeName == VenueFader.name) {
            venue = venue.venueCurrent();
        }
        var venueStarsystem = venue;
        var starsystem = venueStarsystem.starsystem;
        starsystem.draw_Body(uwpe, display);
    }
}
