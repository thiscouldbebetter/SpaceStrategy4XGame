"use strict";
class LinkPortal extends Entity {
    constructor(name, defn, pos, starsystemNamesFromAndTo) {
        super(name, [
            // defn,
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable(LinkPortal.toControl),
            Drawable.fromVisual(LinkPortal.visualProjected()),
            Locatable.fromPos(pos)
        ]);
        this.defn = defn;
        this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
    }
    static bodyDefn() {
        var visual = new VisualNone(); // LinkPortal.visualBeforeProjection();
        var bodyDefnLinkPortal = new BodyDefn("LinkPortal", Coords.fromXY(10, 10), // size
        visual);
        return bodyDefnLinkPortal;
    }
    link(cluster) {
        var returnValue = cluster.linkByStarsystemNamesFromTo(this.starsystemNameFrom(), this.starsystemNameTo());
        return returnValue;
    }
    nameAccordingToFactionPlayerKnowledge(world) {
        var factionPlayer = world.factionPlayer();
        var factionKnowledge = factionPlayer.knowledge;
        var starsystemToName = this.starsystemNameTo();
        var isStarsystemToKnown = factionKnowledge.starsystemWithNameIsKnown(starsystemToName);
        var returnValue = isStarsystemToKnown
            ? this.name
            : "Link to " + FactionKnowledge.TextUnknownStarsystem;
        return returnValue;
    }
    starsystemFrom(cluster) {
        var starsystemName = this.starsystemNameFrom();
        var returnValue = cluster.nodeByName(starsystemName).starsystem;
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
        var returnValue = cluster.nodeByName(starsystemName).starsystem;
        return returnValue;
    }
    // controls
    static toControl(uwpe, size, controlTypeName) {
        var linkPortal = uwpe.entity;
        var world = uwpe.world;
        var name = linkPortal.nameAccordingToFactionPlayerKnowledge(world);
        var returnValue = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(0, 0), size, DataBinding.fromContext(name), FontNameAndHeight.fromHeightInPixels(10));
        return returnValue;
    }
    // Drawable.
    static visualBeforeProjection() {
        var colors = Color.Instances();
        var radius = 10;
        var visualsForLinkTypes = new Array();
        var colorsAtCenter = [colors.Black, colors.Red];
        for (var i = 0; i < colorsAtCenter.length; i++) {
            var colorAtCenter = colorsAtCenter[i];
            var visualCenter = new VisualCircleGradient(radius, new ValueBreakGroup([
                new ValueBreak(0, colorAtCenter),
                new ValueBreak(.5, colorAtCenter),
                new ValueBreak(.75, colors.Violet),
                new ValueBreak(1, colors.Blue)
            ], null // interpolationMode
            ), null // colorBorder
            );
            visualsForLinkTypes.push(visualCenter);
        }
        var visual = VisualSelect.fromSelectChildToShowAndChildren((uwpe, visualSelect) => {
            var linkPortal = uwpe.entity;
            var world = uwpe.world;
            var starCluster = world.starCluster;
            var link = linkPortal.link(starCluster);
            var linkType = link.type;
            var visualName = linkType.name;
            var childToShowIndex = (visualName == "Normal") ? 0 : 1;
            var childToShow = visualSelect.children[childToShowIndex];
            return childToShow;
        }, visualsForLinkTypes);
        return visual;
    }
    static visualProjected() {
        var visualBeforeProjection = LinkPortal.visualBeforeProjection();
        var visual = new VisualCameraProjection(uwpe => uwpe.place.camera2(uwpe.universe), visualBeforeProjection);
        var visualWithStem = new VisualGroup([
            new VisualElevationStem(),
            visual
        ]);
        return visualWithStem;
    }
}
