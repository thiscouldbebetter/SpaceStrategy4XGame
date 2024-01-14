"use strict";
class VisualStar {
    constructor(name, color, radiusActual) {
        this.name = name;
        this.color = color;
        this.radiusActual = radiusActual;
        this._drawPos = Coords.create();
    }
    static fromNameColorAndRadiusActual(name, color, radiusActual) {
        return new VisualStar(name, color, radiusActual);
    }
    static byName(name) {
        return VisualStar.Instances().byName(name);
    }
    static Instances() {
        if (VisualStar._instances == null) {
            VisualStar._instances = new VisualStar_Instances();
        }
        return VisualStar._instances;
    }
    static radiusActual() {
        return 4; // todo
    }
    // Visual.
    draw(uwpe, display) {
        var universe = uwpe.universe;
        var world = universe.world;
        var starClusterNode = uwpe.entity;
        var display = universe.display;
        var nodePos = starClusterNode.locatable().loc.pos;
        var drawPos = this._drawPos.overwriteWith(nodePos);
        var camera = world.camera;
        camera.coordsTransformWorldToView(drawPos);
        var perspectiveFactor = camera.focalLength / drawPos.z;
        var radiusApparent = this.radiusActual * perspectiveFactor;
        var fadeFactor = Math.pow(perspectiveFactor, 4); // hack
        if (fadeFactor > 1) {
            fadeFactor = 1;
        }
        var colors = Color.Instances();
        var colorAtCenter = colors.White.clone().valueMultiplyByScalar(2 * fadeFactor);
        var colorAtBorder = this.color.clone().valueMultiplyByScalar(fadeFactor);
        var colorSpace = colorAtBorder.clone().alphaSet(0);
        var display = universe.display;
        var gradient = new ValueBreakGroup([
            new ValueBreak(0, colorAtCenter),
            new ValueBreak(0.5, colorAtCenter),
            new ValueBreak(0.8, colorAtBorder),
            new ValueBreak(1, colorSpace),
        ], null);
        var visual = new VisualCircleGradient(radiusApparent, gradient, null // colorBorder
        );
        var locatable = new Locatable(Disposition.fromPos(drawPos));
        var drawableTransformed = new Entity("[drawable]", [locatable]);
        visual.draw(new UniverseWorldPlaceEntities(universe, world, null, drawableTransformed, null), display);
        var starsystem = starClusterNode.starsystem;
        if (starsystem != null) {
            this.draw_Starsystem(uwpe, radiusApparent, drawPos, colorAtCenter, starsystem);
        }
    }
    draw_Starsystem(uwpe, radiusApparent, starsystemDrawPos, nodeColor, starsystem) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var display = universe.display;
        var factionsPresent = new Array();
        var planets = starsystem.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            var planetFaction = planet.faction();
            if (planetFaction != null) {
                factionsPresent.push(planetFaction);
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
            visualRing.draw(uwpe.entitySet(drawableTransformed), display);
        }
        var ships = starsystem.ships;
        var factions = world.factions();
        var shipsSortedByFactionIndex = ships.sort((a, b) => {
            var returnValue = factions.indexOf(a.faction())
                - factions.indexOf(b.faction());
            return returnValue;
        });
        var shipFactionPrev = null;
        var shipOffsetIncrement = Coords.fromXY(0, -1).multiplyScalar(radiusApparent);
        var factionsSoFar = 0;
        for (var i = 0; i < shipsSortedByFactionIndex.length; i++) {
            var ship = ships[i];
            var shipFaction = ship.faction();
            if (shipFaction != shipFactionPrev) {
                factionsSoFar++;
                var shipColor = shipFaction.color;
                var shipOffset = shipOffsetIncrement.clone();
                shipOffset.y *= factionsSoFar + 1;
                drawablePosTransformed.overwriteWith(starsystemDrawPos).add(shipOffset);
                var visualShip = new VisualPolygon(new Path([
                    Coords.fromXY(0, 0),
                    Coords.fromXY(.5, -1).multiplyScalar(radiusApparent),
                    Coords.fromXY(-.5, -1).multiplyScalar(radiusApparent),
                ]), shipColor, null, // colorBorder
                false // shouldUseEntityOrientation
                );
                visualShip.draw(uwpe.entitySet(drawableTransformed), display);
            }
            shipFactionPrev = shipFaction;
        }
        var visualText = VisualText.fromTextImmediateFontAndColor(starsystem.name, FontNameAndHeight.fromHeightInPixels(radiusApparent), nodeColor);
        drawablePosTransformed.overwriteWith(starsystemDrawPos);
        drawablePosTransformed.y += radiusApparent * 2;
        visualText.draw(uwpe.entitySet(drawableTransformed), display);
    }
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
class VisualStar_Instances {
    constructor() {
        var vs = (n, c, ra) => VisualStar.fromNameColorAndRadiusActual(n, c, ra);
        var colors = Color.Instances();
        var radius = VisualStar.radiusActual();
        this.Default = vs("Default", colors.White, radius);
        this.Blue = vs("Blue", colors.Blue, radius);
        this.Green = vs("Green", colors.Green, radius);
        this.Orange = vs("Orange", colors.Orange, radius);
        this.Red = vs("Red", colors.Red, radius);
        this.White = vs("White", colors.White, radius);
        this.Yellow = vs("Yellow", colors.Yellow, radius);
        this._All =
            [
                this.Default,
                this.Blue,
                this.Green,
                this.Orange,
                this.Red,
                this.White,
                this.Yellow
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
