"use strict";
class VisualGrid {
    constructor(gridDimensionInCells, gridCellDimensionInPixels, color) {
        this.gridSizeInCells =
            Coords.fromXY(1, 1).multiplyScalar(gridDimensionInCells);
        this.gridCellSizeInPixels =
            Coords.fromXY(1, 1).multiplyScalar(gridCellDimensionInPixels);
        this.color = color;
        this.gridSizeInPixels =
            this.gridSizeInCells.clone().multiply(this.gridCellSizeInPixels);
        this.gridSizeInCellsHalf = this.gridSizeInCells.clone().half();
        this.gridSizeInPixelsHalf = this.gridSizeInPixels.clone().half();
        // Helper variables.
        this.displacement = Coords.create();
        this.drawPosFrom = Coords.create();
        this.drawPosTo = Coords.create();
        this.multiplier = Coords.create();
        this.multiplierTimesI = Coords.create();
    }
    draw(uwpe, display) {
        var universe = uwpe.universe;
        var starsystem = universe.venueCurrent().starsystem;
        if (starsystem == null) {
            return;
        }
        var camera = starsystem.camera2(universe);
        var drawPosFrom = this.drawPosFrom;
        var drawPosTo = this.drawPosTo;
        var multiplier = this.multiplier;
        var multiplierTimesI = this.multiplierTimesI;
        for (var d = 0; d < 2; d++) {
            multiplier.clear();
            multiplier.dimensionSet(d, this.gridCellSizeInPixels.dimensionGet(d));
            for (var i = 0 - this.gridSizeInCellsHalf.x; i <= this.gridSizeInCellsHalf.x; i++) {
                drawPosFrom.overwriteWith(this.gridSizeInPixelsHalf).multiplyScalar(-1);
                drawPosTo.overwriteWith(this.gridSizeInPixelsHalf);
                drawPosFrom.dimensionSet(d, 0);
                drawPosTo.dimensionSet(d, 0);
                multiplierTimesI.overwriteWith(multiplier).multiplyScalar(i);
                drawPosFrom.add(multiplierTimesI);
                drawPosTo.add(multiplierTimesI);
                camera.coordsTransformWorldToView(drawPosFrom);
                camera.coordsTransformWorldToView(drawPosTo);
                if (drawPosFrom.z >= 0 && drawPosTo.z >= 0) {
                    // todo - Real clipping.
                    display.drawLine(drawPosFrom, drawPosTo, this.color, null);
                }
            }
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Transformable.
    transform(transform) { return this; }
}
