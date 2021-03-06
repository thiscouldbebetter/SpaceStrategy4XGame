"use strict";
class NetworkNode2 extends Entity {
    constructor(name, defn, pos, starsystem) {
        super(name, [
            Locatable.fromPos(pos)
        ]);
        this.defn = defn;
        this.starsystem = starsystem;
        // Helper variables.
        this.drawPos = Coords.create();
        this.drawLoc = Disposition.fromPos(this.drawPos);
    }
    // Controls.
    toControl(universe) {
        var world = universe.world;
        var viewSize = universe.display.sizeInPixels;
        var containerSize = Coords.fromXY(100, 80);
        var margin = 10;
        var controlSpacing = 8;
        var fontHeightInPixels = margin;
        var buttonSize = Coords.fromXY(containerSize.x - margin * 4, 10);
        var returnValue = ControlContainer.from4("containerStarsystem", Coords.fromXY(viewSize.x - margin - containerSize.x, margin), // pos
        Coords.fromXY(containerSize.x - margin * 2, 40), // size
        // children
        [
            ControlLabel.from5("labelStarsystemName", Coords.fromXY(margin, margin), Coords.fromXY(0, 0), // this.size
            false, // isTextCentered
            DataBinding.fromContext(this.name)),
            ControlLabel.from5("labelStarsystemHolder", Coords.fromXY(margin, margin + controlSpacing), Coords.fromXY(0, 0), // this.size
            false, // isTextCentered
            DataBinding.fromContextAndGet(this.starsystem, (c) => c.faction(world).name)),
            ControlButton.from8("buttonView", Coords.fromXY(margin, margin + controlSpacing * 2), // pos
            buttonSize, // size
            "View", fontHeightInPixels, true, // hasBorder
            true, // isEnabled
            (universe) => // click
             {
                var venueCurrent = universe.venueCurrent;
                var starsystemToView = venueCurrent.selection.starsystem;
                if (starsystemToView != null) {
                    universe.venueNext =
                        new VenueStarsystem(venueCurrent, starsystemToView);
                }
            }),
        ]);
        return returnValue;
    }
    // drawable
    draw(universe, nodeRadiusActual, camera) {
        var world = universe.world;
        var display = universe.display;
        var nodePos = this.locatable().loc.pos;
        var drawPos = this.drawPos.overwriteWith(nodePos);
        camera.coordsTransformWorldToView(drawPos);
        var perspectiveFactor = camera.focalLength / drawPos.z;
        var radiusApparent = nodeRadiusActual * perspectiveFactor;
        var alpha = Math.pow(perspectiveFactor, 4); // hack
        if (alpha > 1) {
            alpha = 1;
        }
        var nodeColor = new Color("Node", "", [1, 1, 1, alpha]);
        var display = universe.display;
        var gradient = new ValueBreakGroup([
            new ValueBreak(0, Color.byName("White")),
            new ValueBreak(1, nodeColor),
        ], null);
        var visual = new VisualCircleGradient(radiusApparent, gradient, null // colorBorder
        );
        var locatable = new Locatable(Disposition.fromPos(drawPos));
        var drawableTransformed = new Entity("[drawable]", [locatable]);
        visual.draw(universe, world, null, drawableTransformed, display);
        var starsystem = this.starsystem;
        if (starsystem != null) {
            this.draw_Starsystem(universe, radiusApparent, drawPos, nodeColor, starsystem);
        }
    }
    draw_Starsystem(universe, radiusApparent, starsystemDrawPos, nodeColor, starsystem) {
        var world = universe.world;
        var display = universe.display;
        var factionsPresent = [];
        var planets = starsystem.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            if (planet.factionName != null) {
                var faction = planet.faction(world);
                factionsPresent.push(faction);
            }
        }
        var drawablePosTransformed = starsystemDrawPos.clone();
        var drawableLocTransformed = Disposition.fromPos(drawablePosTransformed);
        var drawableLocatable = new Locatable(drawableLocTransformed);
        var drawableTransformed = new Entity("drawable", [drawableLocatable]);
        var ringThickness = radiusApparent * .1;
        for (var i = 0; i < factionsPresent.length; i++) {
            var faction = factionsPresent[i];
            var factionColor = faction.color;
            var ringRadius = radiusApparent + (ringThickness * (i + 5));
            var visualRing = new VisualCircle(ringRadius, null, factionColor, null);
            visualRing.draw(universe, world, null, drawableTransformed, display);
        }
        var ships = starsystem.ships;
        var shipOffset = Coords.fromXY(0, -2).multiplyScalar(radiusApparent);
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            var shipFaction = ship.faction(world);
            var shipColor = shipFaction.color;
            drawablePosTransformed.overwriteWith(starsystemDrawPos).add(shipOffset);
            var visualShip = new VisualPolygon(new Path([
                Coords.fromXY(0, 0),
                Coords.fromXY(.5, -1).multiplyScalar(radiusApparent),
                Coords.fromXY(-.5, -1).multiplyScalar(radiusApparent),
            ]), shipColor, null);
            visualShip.draw(universe, world, null, drawableTransformed, display);
        }
        var visualText = VisualText.fromTextAndColor(this.starsystem.name, nodeColor);
        drawablePosTransformed.overwriteWith(starsystemDrawPos);
        drawablePosTransformed.y += radiusApparent * 2;
        visualText.draw(universe, world, null, drawableTransformed, display);
    }
    static RadiusActual() {
        return 4;
    }
}
