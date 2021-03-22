"use strict";
class Cursor extends EntityProperty {
    constructor() {
        super();
        this.bodyUnderneath = null;
        this.bodyParent = null;
        this.orderName = null;
        this.mustTargetBody = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
        this.defn = this.bodyDefn();
        var loc = Disposition.fromPos(Coords.create());
        this._locatable = new Locatable(loc);
        var constrainable = new Constrainable([
            new Constraint_Cursor()
        ]);
        this.constrainable = () => constrainable;
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
            var cursor = EntityExtensions.cursor(entity);
            if (cursor.bodyParent == null) {
                returnValue = "_0";
            }
            else if (cursor.mustTargetBody) {
                returnValue = "_1";
            }
            else {
                returnValue = "_1";
            }
            return [returnValue];
        });
        var visualHover = new VisualText(DataBinding.fromContextAndGet(this, (c) => {
            var returnValue;
            if (c.bodyUnderneath == null) {
                returnValue = "";
            }
            else {
                returnValue = c.bodyUnderneath.name;
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
        this.bodyParent = null;
        this.orderName = null;
        this.hasXYPositionBeenSpecified = false;
        this.hasZPositionBeenSpecified = false;
    }
    locatable() {
        return this._locatable;
    }
    set(actor, orderName, mustTargetBody) {
        this.bodyParent = actor;
        this.orderName = orderName;
        this.mustTargetBody = mustTargetBody;
    }
    toEntity() {
        if (this._entity == null) {
            var body = new Body(Cursor.name, this.bodyDefn(), this.locatable().loc.pos);
            this._entity = new Entity(Cursor.name, [this, body, this.constrainable(), this.locatable()]);
        }
        return this._entity;
    }
    // controls
    toControl(universe, controlSize) {
        return this.bodyParent.toEntity().controllable().toControl(universe, controlSize);
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
        starsystem.draw_Body(universe, world, place, this.toEntity(), display);
    }
}
