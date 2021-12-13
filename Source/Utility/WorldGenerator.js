"use strict";
class WorldGenerator {
    constructor(starsystemCount, factionCount) {
        this.starsystemCount = starsystemCount;
        this.factionCount = factionCount;
        this.starsystemCountsAvailable = [2, 8, 32, 128, 256];
        this.factionCountsAvailable = [2, 3, 4, 5, 6, 7];
    }
    toControl(universe) {
        var size = universe.display.sizeInPixels;
        var margin = 8;
        var controlHeight = 12;
        var fontHeightInPixels = 10;
        var buttonSize = Coords.fromXY(4, 1).multiplyScalar(controlHeight);
        var labelSize = Coords.fromXY(4, 1).multiplyScalar(controlHeight);
        var column1PosX = margin * 2 + labelSize.x;
        var childControls = [
            new ControlLabel("labelWorldGenerationCriteria", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("World Generation Criteria:"), // text
            fontHeightInPixels),
            new ControlLabel("labelStarsystemCount", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Starsystems:"), // text
            fontHeightInPixels),
            new ControlSelect("selectStarsystemCount", Coords.fromXY(column1PosX, margin * 2 + controlHeight), // pos
            buttonSize, new DataBinding(this, (c) => c.factionCount, (c, v) => c.factionCount = v), // valueSelected
            // options
            DataBinding.fromContextAndGet(this, (c) => c.starsystemCountsAvailable), DataBinding.fromGet((c) => c), // bindingForOptionValue
            DataBinding.fromGet((c) => "" + c), // bindingForOptionText
            fontHeightInPixels),
            new ControlLabel("labelFactionCount", Coords.fromXY(margin, margin * 3 + controlHeight * 2), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Factions:"), // text
            fontHeightInPixels),
            new ControlSelect("selectFactionCount", Coords.fromXY(column1PosX, margin * 3 + controlHeight * 2), // pos
            buttonSize, new DataBinding(this, (c) => c.factionCount, (c, v) => c.factionCount = v), // valueSelected
            // options
            DataBinding.fromContextAndGet(this, (c) => c.factionCountsAvailable), DataBinding.fromGet((c) => c), // bindingForOptionValue
            DataBinding.fromGet((c) => "" + c), // bindingForOptionText
            fontHeightInPixels),
            new ControlButton("buttonGenerate", Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), buttonSize, "Generate", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled,
            () => // click
             {
                alert("todo");
            }, false // canBeHeldDown
            ),
        ];
        var returnValue = new ControlContainer("containerCreate", Coords.zeroes(), size, childControls, [], // actions,
        null //?
        );
        return returnValue;
    }
}
