"use strict";
class DiplomaticSession {
    constructor(diplomaticActions, factionActing, factions, venueParent) {
        this.diplomaticActions = diplomaticActions;
        this.diplomaticActionsByName =
            ArrayHelper.addLookupsByName(this.diplomaticActions);
        this.factionActing = factionActing;
        this.factions = factions;
        this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
        this.venueParent = venueParent;
        this.factionSelected = null;
    }
    // static methods
    static demo(factionActing, factions, venueParent) {
        var diplomaticActions = DiplomaticAction.Instances()._All;
        var session = new DiplomaticSession(diplomaticActions, factionActing, factions, venueParent);
        return session;
    }
    // instance methods
    isFactionSelected() {
        return (this.factionSelected != null);
    }
    talkSessionInitialize(universe) {
        var talkSession = TalkSession.buildExample(this.factionActing, this.factionSelected);
        var venueNext = new VenueTalkSession(universe.venueCurrent, talkSession);
        venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
        universe.venueNext = venueNext;
    }
    // controls
    toControl(universe) {
        var containerSize = universe.display.sizeInPixels.clone();
        var margin = 10;
        var controlHeight = 20;
        var listWidth = 100;
        var fontHeightInPixels = margin;
        var returnValue = ControlContainer.from4("containerProfileSelect", Coords.fromXY(0, 0), // pos
        containerSize, 
        // children
        [
            ControlButton.from9("buttonBack", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "<", fontHeightInPixels, true, // hasBorder
            true, // isEnabled
            (universe) => // click
             {
                var venueNext = universe.world.toVenue();
                venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                universe.venueNext = venueNext;
            }, universe // context
            ),
            ControlLabel.from5("labelFactions", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(100, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Factions:")),
            ControlList.from8("listFactions", Coords.fromXY(margin, margin * 2 + controlHeight * 2), // pos
            Coords.fromXY(listWidth, controlHeight * 4), // size
            DataBinding.fromContext(this.factions), // items
            DataBinding.fromGet((c) => c.name), // bindingForItemText,
            fontHeightInPixels, 
            // bindingForItemSelected
            new DataBinding(this, (c) => c.factionSelected, (c, v) => c.factionSelected = v), DataBinding.fromContext(null) // bindingForItemValue
            ),
            ControlButton.from8("buttonTalk", Coords.fromXY(margin, margin * 3 + controlHeight * 6), // pos
            Coords.fromXY(listWidth, controlHeight), // size
            "Talk", fontHeightInPixels, true, // hasBorder
            DataBinding.fromContextAndGet(this, (c) => c.isFactionSelected()), // isEnabled
            this.talkSessionInitialize.bind(this, universe) // click
            ),
            Faction.toControl_Intelligence(this, Coords.fromXY(margin * 2 + listWidth, 0), // pos
            Coords.fromXY(containerSize.x - listWidth - margin * 2, containerSize.y))
        ]);
        return returnValue;
    }
}
