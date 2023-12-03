"use strict";
class PlanetType {
    constructor(size, environment) {
        this.size = size;
        this.environment = environment;
    }
    static byName(name) {
        return PlanetType.Instances().byName(name);
    }
    static random() {
        return PlanetType.Instances().random();
    }
    static Instances() {
        if (PlanetType._instances == null) {
            PlanetType._instances = new PlanetType_Instances();
        }
        return PlanetType._instances;
    }
    bodyDefn() {
        if (this._bodyDefn == null) {
            var planetDimension = this.size.radiusInPixels;
            var size = Coords.fromXY(1, 1).multiplyScalar(planetDimension);
            var colors = Color.Instances();
            var colorAtCenter = this.environment.color; // White;
            var colorMiddle = colorAtCenter;
            var colorSpace = colors.Black;
            var visualForPlanetType = new VisualCircleGradient(planetDimension, // radius
            new ValueBreakGroup([
                new ValueBreak(0, colorAtCenter),
                new ValueBreak(.2, colorAtCenter),
                new ValueBreak(.3, colorMiddle),
                new ValueBreak(.75, colorMiddle),
                new ValueBreak(1, colorSpace),
            ], null // ?
            ), null // colorBorder
            );
            var visualLabel = new VisualDynamic // todo - VisualDynamic2?
            ((uwpe) => {
                var planet = uwpe.entity;
                var factionName = planet.factionable().factionName;
                var returnValue = (factionName == null
                    ? new VisualNone()
                    : new VisualOffset(Coords.fromXY(0, planet.planetType.size.radiusInPixels * 2), VisualText.fromTextImmediateHeightAndColor("Owned by " + factionName, planetDimension, Color.byName("White"))));
                return returnValue;
            });
            var visual = new VisualGroup([
                visualForPlanetType,
                visualLabel
            ]);
            this._bodyDefn = new BodyDefn(this.name(), size, visual);
        }
        return this._bodyDefn;
    }
    byName(name) {
        return PlanetType.Instances().byName(name);
    }
    layoutCreate(universe) {
        var rowsForOrbit = 2;
        var rowsForOrbitAndSeparator = rowsForOrbit + 1;
        var mapSizeInCells = this.size.surfaceSizeInCells.clone().addXY(0, rowsForOrbitAndSeparator);
        var world = universe.world;
        var mapCellSizeInPixels = world.mapCellSizeInPixels(universe);
        var mapSizeInPixels = mapSizeInCells.clone().multiply(mapCellSizeInPixels);
        var viewSize = universe.display.sizeInPixels;
        var mapPosInPixels = viewSize.clone().subtract(mapSizeInPixels).divideScalar(2).add(mapCellSizeInPixels.clone().half());
        mapPosInPixels.z = 0;
        var terrains = MapTerrain.Instances(mapCellSizeInPixels);
        var terrainDistribution = this.environment.terrainsToWeightedDistribution(terrains);
        var cellRowsAsStrings = new Array();
        for (var y = 0; y < mapSizeInCells.y; y++) {
            var cellRowAsString = "";
            if (y < rowsForOrbit) {
                var terrainOrbit = terrains.Orbit;
                cellRowAsString = "".padEnd(mapSizeInCells.x, terrainOrbit.codeChar);
            }
            else if (y < rowsForOrbitAndSeparator) {
                var terrainNone = terrains.None;
                cellRowAsString = "".padEnd(mapSizeInCells.x, terrainNone.codeChar);
            }
            else {
                for (var x = 0; x < mapSizeInCells.x; x++) {
                    var terrain = terrainDistribution.valueRandom();
                    cellRowAsString += terrain.codeChar;
                }
            }
            cellRowsAsStrings.push(cellRowAsString);
        }
        var map = new MapLayout(mapSizeInPixels, // mapSizeInPixels
        mapPosInPixels, terrains._Planet, cellRowsAsStrings, [] // bodies
        );
        var layout = new Layout(viewSize.clone(), // sizeInPixels
        map);
        return layout;
    }
    name() {
        return this.size.name + " " + this.environment.name;
    }
}
class PlanetType_Instances {
    constructor() {
        var pt = (size, environment) => new PlanetType(size, environment);
        var sizes = PlanetSize.Instances()._All;
        var environments = PlanetEnvironment.Instances()._All;
        var planetTypes = [];
        for (var s = 0; s < sizes.length; s++) {
            var size = sizes[s];
            for (var e = 0; e < environments.length; e++) {
                var environment = environments[e];
                var planetType = pt(size, environment);
                planetTypes.push(planetType);
            }
        }
        this._All = planetTypes;
    }
    byName(name) {
        return this._All.find(x => x.name() == name);
    }
    random() {
        var indexRandom = Math.floor(Math.random() * this._All.length);
        var planetTypeRandom = this._All[indexRandom];
        return planetTypeRandom;
    }
}
