"use strict";
class LinkPortal extends Entity {
    constructor(name, defn, pos, starsystemNamesFromAndTo) {
        super(name, [
            defn,
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable(LinkPortal.toControl),
            Locatable.fromPos(pos)
        ]);
        this.defn = defn;
        this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
    }
    static bodyDefn() {
        var colors = Color.Instances();
        var bodyDefnLinkPortal = new BodyDefn("LinkPortal", Coords.fromXY(10, 10), // size
        new VisualGroup([
            new VisualCircleGradient(10, // radius
            new ValueBreakGroup([
                new ValueBreak(0, colors.Black),
                new ValueBreak(.5, colors.Black),
                new ValueBreak(.75, colors.Violet),
                new ValueBreak(1, colors.Blue)
            ], null // interpolationMode
            ), null // colorBorder
            )
        ]));
        return bodyDefnLinkPortal;
    }
    link(cluster) {
        var returnValue = cluster.linkByStarsystemNamesFromTo(this.starsystemNameFrom(), this.starsystemNameTo());
        return returnValue;
    }
    starsystemFrom(cluster) {
        var starsystemName = this.starsystemNameFrom();
        var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
        return returnValue;
    }
    starsystemNameFrom() {
        return this.starsystemNamesFromAndTo[0];
    }
    starsystemNameTo() {
        return this.starsystemNamesFromAndTo[1];
    }
    starsystemTo(cluster) {
        var starsystemName = this.starsystemNameTo();
        var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
        return returnValue;
    }
    // controls
    static toControl(uwpe, size, controlTypeName) {
        var linkPortal = uwpe.entity;
        var returnValue = ControlLabel.from4Uncentered(Coords.fromXY(0, 0), size, DataBinding.fromContext("Link to " + linkPortal.starsystemNamesFromAndTo[1]), FontNameAndHeight.fromHeightInPixels(10));
        return returnValue;
    }
}
