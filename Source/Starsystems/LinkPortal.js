"use strict";
class LinkPortal extends Entity {
    constructor(name, defn, pos, starsystemNamesFromAndTo) {
        super(name, [
            defn,
            Locatable.fromPos(pos)
        ]);
        this.defn = defn;
        this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
    }
    static bodyDefn() {
        var bodyDefnLinkPortal = new BodyDefn("LinkPortal", Coords.fromXY(10, 10), // size
        new VisualGroup([
            new VisualCircleGradient(10, // radius
            new ValueBreakGroup([
                new ValueBreak(0, Color.byName("Black")),
                new ValueBreak(.5, Color.byName("Black")),
                new ValueBreak(.75, Color.byName("Violet")),
                new ValueBreak(1, Color.byName("Blue"))
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
    toControl() {
        var returnValue = new ControlLabel("labelLinkPortalAsSelection", Coords.fromXY(0, 0), Coords.fromXY(0, 0), // this.size
        false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext("Link to " + this.starsystemNamesFromAndTo[1]), 10 // fontHeightInPixels
        );
        return returnValue;
    }
}
