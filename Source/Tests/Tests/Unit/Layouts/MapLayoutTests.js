"use strict";
class MapLayoutTests extends TestFixture {
    constructor() {
        super(MapLayoutTests.name);
    }
    tests() {
        var returnValues = [
            this.bodiesNeighboringCursor,
            this.bodiesNeighboringPosInCells,
            this.bodyAtPosInCells,
            this.bodyAtCursor,
            this.terrainAtPosInCells,
            this.terrainAtCursor,
            this.draw
        ];
        return returnValues;
    }
    // Setup.
    mapLayoutBuild() {
        var visual = new VisualNone();
        var terrain = new MapTerrain("Surface", ".", "[description]", visual);
        var terrains = [terrain];
        var cellsAsStrings = [
            "........",
            "........",
            "........",
            "........"
        ];
        var drawable = Drawable.fromVisual(visual);
        var entities = [
            new Entity("[name]", [
                drawable,
                Locatable.fromPos(Coords.zeroes())
            ]),
            new Entity("[name2]", [
                drawable,
                Locatable.fromPos(Coords.ones())
            ]),
            new Entity("[name3]", [
                drawable,
                Locatable.fromPos(Coords.twos())
            ]),
        ];
        var returnValue = new MapLayout(Coords.fromXY(100, 100), // sizeInPixels
        Coords.zeroes(), // pos
        terrains, cellsAsStrings, entities);
        return returnValue;
    }
    universeBuild() {
        return new EnvironmentMock().universeBuild();
    }
    // Tests.
    // instance methods
    bodiesNeighboringCursor() {
        var map = this.mapLayoutBuild();
        var entities = map.entitiesNeighboringCursor();
        Assert.isNotNull(entities);
    }
    bodiesNeighboringPosInCells() {
        var map = this.mapLayoutBuild();
        var centerPosInCells = Coords.zeroes();
        var entities = map.entitiesNeighboringPosInCells(centerPosInCells);
        Assert.isNotNull(entities);
    }
    bodyAtPosInCells() {
        var map = this.mapLayoutBuild();
        var posInCells = Coords.zeroes();
        var entityAtPos = map.entityAtPosInCells(posInCells);
        Assert.isNotNull(entityAtPos);
    }
    bodyAtCursor() {
        var map = this.mapLayoutBuild();
        var entityAtCursor = map.entityAtCursor();
        Assert.isNotNull(entityAtCursor);
    }
    terrainAtPosInCells() {
        var map = this.mapLayoutBuild();
        var posInCells = Coords.zeroes();
        var terrain = map.terrainAtPosInCells(posInCells);
        Assert.isNotNull(terrain);
    }
    terrainAtCursor() {
        var map = this.mapLayoutBuild();
        var terrain = map.terrainAtCursor();
        Assert.isNotNull(terrain);
    }
    // drawable
    draw() {
        var universe = this.universeBuild();
        var map = this.mapLayoutBuild();
        map.draw(universe, universe.display);
    }
}
