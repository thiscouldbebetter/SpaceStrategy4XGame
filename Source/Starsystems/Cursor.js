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
        this.mustTargetEntity = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
        this.defn = this.bodyDefn();
    }
    bodyDefn() {
        var radius = 5;
        var color = Color.Instances().White;
        var visualReticle = new VisualSelect(new Map([
            ["_0", new VisualNone()],
            [
                "_1",
                new VisualGroup([
                    new VisualCircle(radius, null, color, null),
                    new VisualLine(Coords.fromXY(-radius, 0), Coords.fromXY(radius, 0), color, null),
                    new VisualLine(Coords.fromXY(0, -radius), Coords.fromXY(0, radius), color, null),
                ])
            ]
        ]), 
        // selectChildNames
        (universe, world, place, entity, display) => {
            var returnValue;
            var cursor = entity;
            if (cursor.entityParent == null) {
                returnValue = "_0";
            }
            else if (cursor.mustTargetEntity) {
                returnValue = "_1";
            }
            else {
                returnValue = "_1";
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
        }), false, // shouldTextContextBeReset
        null, // heightInPixels
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
    set(entity, orderName, mustTargetEntity) {
        this.entityParent = entity;
        this.orderName = orderName;
        this.mustTargetEntity = mustTargetEntity;
    }
    // controls
    toControl(universe, controlSize) {
        return this.entityParent.controllable().toControl(universe, controlSize);
    }
    // drawable
    draw(universe, world, place, entity, display) {
        var venue = universe.venueCurrent;
        var venueTypeName = venue.constructor.name;
        if (venueTypeName == VenueFader.name) {
            venue = venue.venueCurrent();
        }
        var venueStarsystem = venue;
        var starsystem = venueStarsystem.starsystem;
        starsystem.draw_Body(universe, world, place, this, display);
    }
}
