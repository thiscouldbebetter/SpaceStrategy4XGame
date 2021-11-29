"use strict";
class TechnologyResearchSession {
    constructor(technologyTree, researcher) {
        this.technologyTree = technologyTree;
        this.researcher = researcher;
    }
    // instance methods
    isResearchNotInProgress() {
        var returnValue = (this.researcher.researchAccumulated == 0);
        return returnValue;
    }
    isTechnologyBeingResearched() {
        return (this.researcher.nameOfTechnologyBeingResearched != null);
    }
    researchAccumulatedIncrement(world, faction, amountToIncrement) {
        this.researcher.researchAccumulatedIncrement(world, faction, amountToIncrement);
    }
    researchRequired() {
        var technologyBeingResearched = this.technologyBeingResearched();
        var returnValue = (technologyBeingResearched == null
            ? 0
            : technologyBeingResearched.researchRequired);
        return returnValue;
    }
    technologyBeingResearched() {
        var techName = this.researcher.nameOfTechnologyBeingResearched;
        var returnValue = this.technologyTree.technologyByName(techName);
        return returnValue;
    }
    // controls
    toControl(universe) {
        var display = universe.display;
        var size = display.sizeInPixels;
        var margin = display.fontHeightInPixels;
        var labelHeight = display.fontHeightInPixels;
        var buttonHeight = labelHeight * 2.5;
        var session = this;
        var returnValue = ControlContainer.from4("containerResearchSession", // name,
        Coords.fromXY(0, 0), // pos,
        size, 
        // children
        [
            ControlLabel.from5("labelResearcher", // name,
            Coords.fromXY(margin, margin), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContext("Researcher:") //text
            ),
            ControlLabel.from5("textResearcher", // name,
            Coords.fromXY(70, margin), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContext(this.researcher.name) //text
            ),
            ControlLabel.from5("labelTechnologiesKnown", // name,
            Coords.fromXY(margin, 30), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContext("Technologies Known:") //text
            ),
            ControlList.from6("listTechnologiesKnown", Coords.fromXY(margin, 45), // pos
            Coords.fromXY(110, 50), // size
            // items
            DataBinding.fromContext(this.researcher.namesOfTechnologiesKnown), DataBinding.fromContext(null), // bindingForItemText
            labelHeight // fontHeightInPixels
            ),
            ControlLabel.from5("labelTechnologiesAvailable", // name,
            Coords.fromXY(140, 30), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContext("Technologies Available:") // text
            ),
            ControlList.from8("listTechnologiesAvailable", // name,
            Coords.fromXY(140, 45), // pos,
            Coords.fromXY(110, 50), // size,
            // items,
            DataBinding.fromContextAndGet(this.researcher, (c) => c.technologiesAvailable(session)), DataBinding.fromGet((c) => c.name), // bindingForItemText
            labelHeight, // fontHeightInPixels
            DataBinding.fromContextAndGet(this.researcher, (c) => c.nameOfTechnologyBeingResearched), // bindingForItemSelected
            DataBinding.fromGet((c) => c.name) // bindingForItemValue
            ),
            ControlLabel.from5("labelTechnologyBeingResearched", // name,
            Coords.fromXY(margin, 120), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContext("Technology Being Researched:") // text
            ),
            ControlLabel.from5("textTechnologyBeingResearched", // name,
            Coords.fromXY(160, 120), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContextAndGet(this.researcher, (c) => c.nameOfTechnologyBeingResearched)),
            ControlLabel.from5("labelResearchAccumulated", // name,
            Coords.fromXY(margin, 135), // pos,
            Coords.fromXY(size.x - margin * 2, labelHeight), // size,
            false, // isTextCentered,
            DataBinding.fromContext("Research Accumulated:") // text
            ),
            ControlLabel.from5("textResearchAccumulated", // name,
            Coords.fromXY(120, 140), // pos,
            Coords.fromXY(30, labelHeight), // size,
            true, // isTextCentered,
            DataBinding.fromContextAndGet(this.researcher, (c) => "" + c.researchAccumulated) // text
            ),
            ControlLabel.from5("labelSlash", // name,
            Coords.fromXY(130, 140), // pos,
            Coords.fromXY(30, labelHeight), // size,
            true, // isTextCentered,
            DataBinding.fromContext("/") // text
            ),
            ControlLabel.from5("textResearchRequired", // name,
            Coords.fromXY(140, 140), // pos,
            Coords.fromXY(30, labelHeight), // size,
            true, // isTextCentered,
            DataBinding.fromContextAndGet(this, (c) => "" + c.technologyBeingResearched().researchRequired) // text
            ),
            ControlButton.from8("buttonResearchPlusOne", //name,
            Coords.fromXY(margin, 155), //pos,
            Coords.fromXY(buttonHeight * 4, buttonHeight), // size,
            "Research + 1", // text,
            labelHeight, // fontHeightInPixels,
            true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var world = universe.world;
                var venue = universe.venueCurrent;
                var session = venue.researchSession;
                var faction = world.factionByName(session.researcher.factionName);
                session.researchAccumulatedIncrement(world, faction, 1);
            }),
            ControlButton.from8("buttonBack", //name,
            Coords.fromXY(margin, size.y - margin - buttonHeight), //pos,
            Coords.fromXY(buttonHeight, buttonHeight), // size,
            "Back", // text,
            labelHeight, // fontHeightInPixels,
            true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venueNext = universe.world.toVenue();
                venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                universe.venueNext = venueNext;
            })
        ]);
        this.control = returnValue;
        return returnValue;
    }
}
