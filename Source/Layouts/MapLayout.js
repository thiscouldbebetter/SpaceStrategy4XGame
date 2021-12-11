"use strict";
class MapLayout {
    constructor(sizeInPixels, pos, terrains, cellsAsStrings, bodies) {
        this.sizeInPixels = sizeInPixels;
        this.pos = pos;
        this.terrains = terrains;
        this.terrainsByCodeChar = ArrayHelper.addLookups(this.terrains, (x) => x.codeChar);
        this.terrainsByName = ArrayHelper.addLookupsByName(this.terrains);
        this.cellsAsStrings = cellsAsStrings;
        this.bodies = bodies;
        this.sizeInCells = new Coords(this.cellsAsStrings[0].length, this.cellsAsStrings.length, 1);
        this.sizeInCellsMinusOnes =
            this.sizeInCells.clone().subtract(new Coords(1, 1, 1));
        this.cellSizeInPixels =
            this.sizeInPixels.clone().divide(this.sizeInCells);
        this.cursor = new MapCursor(null, Coords.zeroes());
        // Helper variables.
        this._cellPos = Coords.zeroes();
        var drawableLocatable = new Locatable(null);
        this._drawable = new Entity("[drawable]", [drawableLocatable]);
        this._neighborOffsets =
            [
                Coords.fromXY(1, 0),
                Coords.fromXY(0, 1),
                Coords.fromXY(-1, 0),
                Coords.fromXY(0, -1),
            ];
    }
    // instance methods
    bodiesNeighboringCursor() {
        return this.bodiesNeighboringPosInCells(this.cursor.pos);
    }
    bodiesNeighboringPosInCells(centerPosInCells) {
        var returnValues = new Array();
        var neighborPos = this._cellPos;
        for (var n = 0; n < this._neighborOffsets.length; n++) {
            var neighborOffset = this._neighborOffsets[n];
            neighborPos.overwriteWith(neighborOffset).add(centerPosInCells);
            var bodyAtNeighborPos = this.bodyAtPosInCells(neighborPos);
            if (bodyAtNeighborPos != null) {
                returnValues.push(bodyAtNeighborPos);
            }
        }
        return returnValues;
    }
    bodyAtPosInCells(cellPos) {
        var returnValue = null;
        for (var i = 0; i < this.bodies.length; i++) {
            var body = this.bodies[i];
            var bodyPos = body.locatable().loc.pos;
            if (bodyPos.equals(cellPos)) {
                returnValue = body;
                break;
            }
        }
        return returnValue;
    }
    bodyAtCursor() {
        return this.bodyAtPosInCells(this.cursor.pos);
    }
    terrainAtPosInCells(cellPos) {
        var terrainCode = this.cellsAsStrings[cellPos.y][cellPos.x];
        var returnValue = this.terrainByCode(terrainCode);
        return returnValue;
    }
    terrainAtCursor() {
        return this.terrainAtPosInCells(this.cursor.pos);
    }
    terrainByCode(terrainCode) {
        return this.terrainsByCodeChar.get(terrainCode);
    }
    terrainByName(terrainName) {
        return this.terrainsByName.get(terrainName);
    }
    // drawable
    draw(universe, display) {
        var world = universe.world;
        var map = this;
        var mapPos = map.pos;
        var mapSizeInCells = map.sizeInCells;
        var cellPos = this._cellPos;
        var drawable = this._drawable;
        var drawPos = drawable.locatable().loc.pos;
        var cellSizeInPixels = map.cellSizeInPixels;
        //var posSaved = Coords.create();
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, drawable, null);
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPos.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPos.x = x;
                drawPos.overwriteWith(cellPos).multiply(cellSizeInPixels).add(mapPos);
                var cellTerrain = map.terrainAtPosInCells(cellPos);
                var terrainVisual = cellTerrain.visual;
                terrainVisual.draw(uwpe, display);
                var cellEntity = map.bodyAtPosInCells(cellPos);
                if (cellEntity != null) {
                    uwpe.entity2Set(cellEntity);
                    var cellBodyVisual = cellEntity.drawable().visual;
                    cellBodyVisual.draw(uwpe, display);
                }
            }
        }
        var cursor = map.cursor;
        var cursorPos = cursor.pos;
        var cursorIsWithinMap = cursorPos.isInRangeMax(map.sizeInCellsMinusOnes);
        if (cursorIsWithinMap) {
            var cursorVisual = new VisualRectangle(Coords.fromXY(10, 10), null, Color.byName("Cyan"), null); // hack
            drawPos.overwriteWith(cursorPos).multiply(cellSizeInPixels).add(mapPos);
            var cellTerrain = this.terrainAtCursor();
            var terrainName = cellTerrain.name;
            if (terrainName != "None") {
                var buildableDefn = cursor.bodyDefn;
                if (buildableDefn != null) {
                    var bodyVisual = buildableDefn.visual;
                    bodyVisual.draw(universe, world, null, drawable, display);
                    var isBuildableAllowedOnTerrain = ArrayHelper.contains(buildableDefn.terrainNamesAllowed, terrainName);
                    if (isBuildableAllowedOnTerrain == false) {
                        var visualNotAllowed = VisualText.fromTextHeightAndColor("X", this.cellSizeInPixels.y, Color.byName("Red"));
                        visualNotAllowed.draw(uwpe, display);
                    }
                }
                cursorVisual.draw(uwpe, display);
            }
        }
    }
}
