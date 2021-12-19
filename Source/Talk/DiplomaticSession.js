"use strict";
class DiplomaticSession {
    constructor(diplomaticActions, factionActing, venueParent) {
        this.diplomaticActions = diplomaticActions;
        this.diplomaticActionsByName =
            ArrayHelper.addLookupsByName(this.diplomaticActions);
        this.factionActing = factionActing;
        this.venueParent = venueParent;
        this.factionSelected = null;
    }
    // static methods
    static demo(factionActing, venueParent) {
        var diplomaticActions = DiplomaticAction.Instances()._All;
        var session = new DiplomaticSession(diplomaticActions, factionActing, venueParent);
        return session;
    }
    // instance methods
    isFactionSelected() {
        return (this.factionSelected != null);
    }
    talkSessionInitialize(uwpe) {
        var universe = uwpe.universe;
        var entityTalker = this.factionActing.toEntity();
        var entityTalkee = this.factionSelected.toEntity();
        /*
        var conversationDefnName = "Diplomacy";
        var conversationDefnAsJSON =
            universe.mediaLibrary.textStringGetByName(conversationDefnName).value;
        var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
        */
        var conversationDefn = this.factionActing.diplomacy.toConversationDefn(universe);
        var venueToReturnTo = universe.venueCurrent;
        var conversationQuit = () => // quit
         {
            universe.venueTransitionTo(venueToReturnTo);
        };
        var conversation = new ConversationRun(conversationDefn, conversationQuit, entityTalkee, entityTalker, // entityTalker
        null // contentsById
        );
        var conversationSize = universe.display.sizeDefault().clone();
        var conversationAsControl = conversation.toControl(conversationSize, universe);
        var venueNext = conversationAsControl.toVenue();
        universe.venueTransitionTo(venueNext);
    }
    // controls
    toControl(universe, containerSize) {
        var world = universe.world;
        var diplomaticSession = this;
        var margin = 10;
        var controlHeight = 20;
        var listWidth = 100;
        var fontHeightInPixels = margin;
        var returnValue = ControlContainer.from4("Diplomacy", Coords.fromXY(0, 0), // pos
        containerSize, 
        // children
        [
            ControlButton.from8("buttonBack", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "<", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venueNext = universe.world.toVenue();
                universe.venueTransitionTo(venueNext);
            }),
            new ControlLabel("labelFactions", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(100, controlHeight), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext("Factions:"), fontHeightInPixels),
            ControlList.from8("listFactions", Coords.fromXY(margin, margin * 2 + controlHeight * 2), // pos
            Coords.fromXY(listWidth, controlHeight * 4), // size
            DataBinding.fromContextAndGet(this, (c) => c.factionActing.knowledge.factionsOther(world)), // items
            DataBinding.fromGet((c) => c.name), // bindingForItemText,
            fontHeightInPixels, 
            // bindingForItemSelected
            new DataBinding(this, (c) => c.factionSelected, (c, v) => c.factionSelected = v), DataBinding.fromContext(null) // bindingForItemValue
            ),
            ControlButton.from8("buttonTalk", Coords.fromXY(margin, margin * 3 + controlHeight * 6), // pos
            Coords.fromXY(listWidth, controlHeight), // size
            "Talk", fontHeightInPixels, true, // hasBorder
            DataBinding.fromContextAndGet(this, (c) => c.isFactionSelected()), // isEnabled
            () => diplomaticSession.talkSessionInitialize(UniverseWorldPlaceEntities.fromUniverse(universe)) // click
            ),
            this.factionActing.diplomacy.toControl(world, this, Coords.fromXY(margin * 2 + listWidth, 0), // pos
            Coords.fromXY(containerSize.x - listWidth - margin * 2, containerSize.y))
        ]);
        return returnValue;
    }
}
