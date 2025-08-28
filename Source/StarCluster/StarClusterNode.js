"use strict";
class StarClusterNode extends Entity {
    constructor(name, defn, pos, star, starsystem) {
        super(name, [
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable((uwpe, size, controlTypeName) => StarClusterNode.toControl(uwpe, size, controlTypeName)),
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
        var labelStarsystemName = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin), Coords.fromXY(0, 0), // this.size
        DataBinding.fromContext(this.name), fontNameAndHeight);
        var labelStarsystemHolder = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin + controlSpacing), Coords.fromXY(0, 0), // this.size
        DataBinding.fromContextAndGet(networkNode, (c) => (c.starsystem == null ? "?" : c.starsystem.factionNameGet(world))), fontNameAndHeight);
        var buttonView = ControlButton.from5(Coords.fromXY(margin, margin + controlSpacing * 2), // pos
        buttonSize, // size
        "View", fontNameAndHeight, () => // click
         {
            var venueCurrent = universe.venueCurrent();
            var starsystemToView = venueCurrent.entitySelected().starsystem;
            if (starsystemToView != null) {
                universe.venueTransitionTo(new VenueStarsystem(venueCurrent, starsystemToView));
            }
        });
        var returnValue = ControlContainer.fromNamePosSizeAndChildren("containerStarsystem", Coords.fromXY(viewSize.x - margin - containerSize.x, margin), // pos
        Coords.fromXY(containerSize.x - margin * 2, 40), // size
        // children
        [
            labelStarsystemName,
            labelStarsystemHolder,
            buttonView
        ]);
        return returnValue;
    }
    // Drawable.
    draw(uwpe) {
        var visual = Drawable.of(this).visual;
        visual.draw(uwpe, uwpe.universe.display);
    }
}
