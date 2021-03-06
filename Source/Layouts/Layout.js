"use strict";
class Layout {
    constructor(sizeInPixels, map) {
        this.sizeInPixels = sizeInPixels;
        this.map = map;
    }
    // static methods
    static planet(universe, planet) {
        var viewSize = universe.display.sizeInPixels;
        var mapSizeInPixels = viewSize.clone().half();
        var mapPosInPixels = viewSize.clone().subtract(mapSizeInPixels).divideScalar(2);
        mapPosInPixels.z = 0;
        var mapSizeInCells = Coords.fromXY(9, 7);
        var mapCellSizeInPixels = mapSizeInPixels.clone().divide(mapSizeInCells);
        var terrains = [
            new MapTerrain("None", " ", new VisualRectangle(mapCellSizeInPixels, null, Color.byName("_Transparent"), null), false),
            new MapTerrain("Orbit", "-", new VisualRectangle(mapCellSizeInPixels, null, Color.byName("Violet"), null), false),
            new MapTerrain("Surface", ".", new VisualRectangle(mapCellSizeInPixels, null, Color.byName("GrayLight"), null), false),
        ];
        var map = new MapLayout(mapSizeInPixels, mapPosInPixels, terrains, 
        // cellsAsStrings
        [
            "---------",
            "         ",
            ".........",
            ".........",
            ".........",
            ".........",
            ".........",
        ], [] // bodies
        );
        var layout = new Layout(viewSize.clone(), // sizeInPixels
        map);
        return layout;
    }
    // instance methods
    // turnable
    facilities() {
        return this.map.bodies;
    }
    initialize(universe) {
        // todo
    }
    updateForTurn(universe, world, faction, parentModel) {
        // todo
        /*
        var bodies = this.map.bodies;
        for (var i = 0; i < bodies.length; i++)
        {
            var body = Body.fromEntity(bodies[i]);
            if (body.updateForTurn != null)
            {
                body.updateForTurn(universe, world, faction, parentModel, this);
            }
        }
        */
    }
    // drawable
    draw(universe, display) {
        display.drawBackground(null, null);
        this.map.draw(universe, display);
    }
}
