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
        var returnValue = ControlLabel.from5("labelLinkPortalAsSelection", Coords.fromXY(0, 0), Coords.fromXY(0, 0), // this.size
        false, // isTextCentered
        DataBinding.fromContext("Link to " + this.starsystemNamesFromAndTo[1]));
        return returnValue;
    }
}
