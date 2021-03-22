"use strict";
class LinkPortal extends EntityProperty {
    constructor(name, defn, pos, starsystemNamesFromAndTo) {
        super();
        this.name = name;
        this.defn = defn;
        var loc = Disposition.fromPos(pos);
        this._locatable = new Locatable(loc);
        this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
    }
    link(cluster) {
        var returnValue = cluster.linkByStarsystemNamesFromTo(this.starsystemNameFrom(), this.starsystemNameTo());
        return returnValue;
    }
    locatable() {
        return this._locatable;
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
    toEntity() {
        if (this._entity == null) {
            var body = new Body(this.name, this.defn, this.pos);
            this._entity = new Entity(this.name, [this, this.locatable(), body]);
        }
        return this._entity;
    }
    // controls
    toControl() {
        var returnValue = ControlLabel.from5("labelLinkPortalAsSelection", Coords.fromXY(0, 0), Coords.fromXY(0, 0), // this.size
        false, // isTextCentered
        DataBinding.fromContext("Link to " + this.starsystemNamesFromAndTo[1]));
        return returnValue;
    }
}
