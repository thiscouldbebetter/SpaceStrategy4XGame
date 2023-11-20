"use strict";
class NetworkNode2 extends Entity {
    constructor(name, defn, pos, star, starsystem) {
        super(name, [
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable(NetworkNode2.toControl),
            Drawable.fromVisual(star.starType.visualFromOutside()),
            Locatable.fromPos(pos)
        ]);
        this.defn = defn;
        this.starsystem = starsystem;
        // Helper variables.
        this.drawPos = Coords.create();
        this.drawLoc = Disposition.fromPos(this.drawPos);
    }
    // Controls.
    static toControl(uwpe, size, controlTypeName) {
        var universe = uwpe.universe;
        var world = universe.world;
        var networkNode = uwpe.entity;
        var viewSize = universe.display.sizeInPixels;
        var containerSize = size;
        var margin = 10;
        var controlSpacing = 8;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var buttonSize = Coords.fromXY(containerSize.x - margin * 4, 10);
        var returnValue = ControlContainer.from4("containerStarsystem", Coords.fromXY(viewSize.x - margin - containerSize.x, margin), // pos
        Coords.fromXY(containerSize.x - margin * 2, 40), // size
        // children
        [
            new ControlLabel("labelStarsystemName", Coords.fromXY(margin, margin), Coords.fromXY(0, 0), // this.size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext(this.name), fontNameAndHeight),
            new ControlLabel("labelStarsystemHolder", Coords.fromXY(margin, margin + controlSpacing), Coords.fromXY(0, 0), // this.size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContextAndGet(networkNode, (c) => (c.starsystem == null ? "?" : c.starsystem.faction(world).name)), fontNameAndHeight),
            ControlButton.from8("buttonView", Coords.fromXY(margin, margin + controlSpacing * 2), // pos
            buttonSize, // size
            "View", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venueCurrent = universe.venueCurrent;
                var starsystemToView = venueCurrent.selectedEntity.starsystem;
                if (starsystemToView != null) {
                    universe.venueNext =
                        new VenueStarsystem(venueCurrent, starsystemToView);
                }
            }),
        ]);
        return returnValue;
    }
    // drawable
    draw(uwpe) {
        var visual = this.drawable().visual;
        visual.draw(uwpe, uwpe.universe.display);
    }
}
