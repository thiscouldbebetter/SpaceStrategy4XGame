"use strict";
class Star extends Entity {
    constructor(name, starType, pos) {
        super(name, [
            starType.bodyDefn(),
            new Controllable(Star.toControl),
            Locatable.fromPos(pos)
        ]);
        this.starType = starType;
    }
    static fromNameStarTypeAndPos(name, starType, pos) {
        return new Star(name, starType, pos);
    }
    // instance methods
    starsystem(world) {
        var networkNodeFound = world.network.nodes.find(x => (x.starsystem.star == this));
        var starsystemFound = (networkNodeFound == null ? null : networkNodeFound.starsystem);
        return starsystemFound;
    }
    toEntity() {
        return this;
    }
    toStringDescription(world) {
        var returnValue = this.name;
        return returnValue;
    }
    // controls
    static toControl(uwpe, size, controlTypeName) {
        var universe = uwpe.universe;
        var star = uwpe.entity;
        var returnValue = star.toControl(universe, size);
        return returnValue;
    }
    toControl(universe, size) {
        var returnValue = ControlContainer.from4("containerStar", Coords.fromXY(0, 0), // pos
        size, [
            new ControlLabel("labelName", Coords.fromXY(0, 0), // pos
            Coords.fromXY(size.x, 0), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext(this.name), FontNameAndHeight.fromHeightInPixels(10))
        ]);
        return returnValue;
    }
}
