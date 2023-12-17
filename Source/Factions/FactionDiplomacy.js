"use strict";
class FactionDiplomacy {
    constructor(factionSelf, communicationStyleName, relationships) {
        this.factionSelf = factionSelf;
        this.communicationStyleName = communicationStyleName;
        this.relationships = relationships;
    }
    static fromFactionSelf(factionSelf) {
        return new FactionDiplomacy(factionSelf, "Default", []);
    }
    relationshipByFaction(factionOther) {
        var relationship = this.relationships.find(x => x.factionOther() == factionOther);
        if (relationship == null) {
            relationship =
                DiplomaticRelationship.fromFactionOther(factionOther);
            this.relationships.push(relationship);
        }
        return relationship;
    }
    shouldAcceptAllianceFrom(factionOther, world) {
        var factionSelf = this.factionSelf;
        var shouldAccept = false;
        var allies = factionSelf.allies(world);
        var enemies = factionSelf.enemies(world);
        var strengthOfSelf = factionSelf.strategicValue(world);
        var strengthOfAllies = allies.reduce((sumSoFar, ally) => sumSoFar + ally.strategicValue(world), 0 // initial
        );
        var strengthOfEnemies = enemies.reduce((sumSoFar, enemy) => sumSoFar + enemy.strategicValue(world), 0 // initial
        );
        var allianceDiscountFactor = 0.5;
        var strengthOfAlliesDiscounted = strengthOfAllies * allianceDiscountFactor;
        var strengthOfSelfAndAlliesAdjusted = strengthOfSelf + strengthOfAlliesDiscounted;
        var strengthRatioOfEnemiesToSelfAndAllies = strengthOfEnemies / strengthOfSelfAndAlliesAdjusted;
        var strengthRatioAboveWhichToAccept = 1;
        if (strengthRatioOfEnemiesToSelfAndAllies
            > strengthRatioAboveWhichToAccept) {
            shouldAccept = true;
        }
        return shouldAccept;
    }
    shouldAcceptPeaceFrom(factionOther, world) {
        var factionSelf = this.factionSelf;
        var shouldAccept = false;
        var allies = factionSelf.allies(world);
        var enemies = factionSelf.enemies(world);
        var strengthOfSelf = factionSelf.strategicValue(world);
        var strengthOfAllies = allies.reduce((sumSoFar, ally) => sumSoFar + ally.strategicValue(world), 0 // initial
        );
        var strengthOfEnemies = enemies.reduce((sumSoFar, enemy) => sumSoFar + enemy.strategicValue(world), 0 // initial
        );
        var allianceDiscountFactor = 0.5;
        var strengthOfAlliesDiscounted = strengthOfAllies * allianceDiscountFactor;
        var strengthOfSelfAndAlliesAdjusted = strengthOfSelf + strengthOfAlliesDiscounted;
        var strengthRatioOfEnemiesToSelfAndAllies = strengthOfEnemies / strengthOfSelfAndAlliesAdjusted;
        var strengthRatioAboveWhichToAccept = 1;
        shouldAccept =
            (strengthRatioOfEnemiesToSelfAndAllies
                > strengthRatioAboveWhichToAccept);
        return shouldAccept;
    }
    // Controls.
    toControl(universe, world, diplomaticSession, pos, containerSize) {
        var margin = 10;
        var controlSpacing = margin * 2;
        var listWidth = margin * 26;
        var columnWidth = margin * 6;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var listSize = Coords.fromXY(listWidth, controlSpacing * 4);
        var labelFaction = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(columnWidth, controlSpacing), // size
        DataBinding.fromContext("Faction:"), fontNameAndHeight);
        var textFaction = ControlLabel.from4Uncentered(Coords.fromXY(margin * 2 + columnWidth, margin), // pos
        Coords.fromXY(columnWidth, controlSpacing), // size,
        DataBinding.fromContextAndGet(diplomaticSession, (c) => (c.factionSelected == null ? "[none]" : c.factionSelected.name)), fontNameAndHeight);
        var labelRelationship = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlSpacing), // pos
        Coords.fromXY(columnWidth, controlSpacing), // size
        DataBinding.fromContext("Relationship:"), fontNameAndHeight);
        var textRelationship = ControlLabel.from4Uncentered(Coords.fromXY(margin + columnWidth, margin + controlSpacing), // pos
        Coords.fromXY(columnWidth, controlSpacing), // size,
        DataBinding.fromContextAndGet(diplomaticSession, (c) => (c.factionSelected == null
            ? "-"
            :
                (c.factionSelected.relationshipByFactionName(diplomaticSession.factionActing.name).state.name))), fontNameAndHeight);
        var labelPlanets = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlSpacing * 2), // pos
        Coords.fromXY(columnWidth, controlSpacing), // size
        DataBinding.fromContext("Planets:"), fontNameAndHeight);
        var listPlanets = ControlList.from8("listPlanets", Coords.fromXY(margin, margin + controlSpacing * 3), // pos
        listSize, DataBinding.fromContextAndGet(diplomaticSession, (c) => (c.factionSelected == null
            ? new Array()
            : c.factionSelected.planets)), // items
        DataBinding.fromGet((c) => c.toStringDescription(universe, world)), // bindingForItemText,
        fontNameAndHeight, 
        // dataBindingForItemSelected
        new DataBinding(diplomaticSession, (c) => (c.factionSelected == null ? null : c.factionSelected.planetSelected), (c, v) => {
            if (c.factionSelected != null) {
                c.factionSelected.planetSelected = v;
            }
        }), null // bindingForItemValue
        );
        var labelShips = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlSpacing * 7), // pos
        Coords.fromXY(columnWidth, controlSpacing), // size
        DataBinding.fromContext("Ships:"), fontNameAndHeight);
        var listShips = ControlList.from7("listShips", Coords.fromXY(margin, margin + controlSpacing * 8), // pos
        listSize, DataBinding.fromContextAndGet(diplomaticSession, (c) => (c.factionSelected == null ? new Array() : c.factionSelected.ships)), // options
        DataBinding.fromGet((c) => c.toStringDescription()), // bindingForOptionText,
        fontNameAndHeight, 
        // dataBindingForValueSelected
        new DataBinding(diplomaticSession, (c) => (c.factionSelected == null ? null : c.factionSelected.shipSelected), (c, v) => {
            if (c.factionSelected != null) {
                c.factionSelected.shipSelected = v;
            }
        }));
        var returnValue = ControlContainer.from4("containerFactionIntelligence", pos, containerSize, 
        // children
        [
            labelFaction,
            textFaction,
            labelRelationship,
            textRelationship,
            labelPlanets,
            listPlanets,
            labelShips,
            listShips
        ]);
        return returnValue;
    }
    // Talk.
    toConversationDefn(universe) {
        var tn = TalkNode;
        var talkNodes = [
            tn.display(null, "(Note: Diplomacy is not fully implemented.)"),
            tn.push("State.Set"),
            tn.doNothing("Greet"),
            tn.display("Greet.War", "We accept your offer of parlay, foe.").disable(),
            tn.display("Greet.Peace", "Greetings, neighbor.").disable(),
            tn.display("Greet.Alliance", "Welcome, friend.").disable(),
            tn.display("StateCurrent.Prompt", "What did you want to talk about?"),
            tn.doNothing("StateCurrent.Prompt.After"),
            tn.option("StateCurrent.War.ToPeace", "My civilization seeks peace with yours.", "StateChange.War.ToPeace").disable(),
            tn.option("StateCurrent.Peace.ToWar", "My civilization declares war on yours.", "StateChange.Peace.ToWar").disable(),
            tn.option("StateCurrent.Peace.ToAlliance", "My civilization seeks an alliance with yours.", "StateChange.Peace.ToAlliance").disable(),
            tn.option("StateCurrent.Alliance.ToPeace", "My civilization is ending its alliance with yours.", "StateChange.Alliance.ToPeace").disable(),
            tn.option("StateCurrent.Peace.Trade", "Would you like to trade information?", "TradeInformation.Push").disable(),
            tn.option("StateCurrent.Alliance.Trade", "Would you like to trade information?", "TradeInformation.Push").disable(),
            tn.option("StateCurrent.Quit", "Never mind.  I'll be leaving now.", "Quit"),
            tn.prompt(),
            tn.variableLoad("StateChange.War.ToPeace", "Accepted", "Faction.fromEntity( cr.talker() ).diplomacy.shouldAcceptAllianceFrom( Faction.fromEntity( cr.player() ), u.world ).toString()"),
            tn._switch("Accepted", [
                ["true", "StateChange.War.ToPeace.Accept"],
                ["false", "StateChange.War.ToPeace.Reject"]
            ]),
            tn.display("StateChange.War.ToPeace.Accept", "Enough of fighting.  We welcome peace."),
            tn.variableSet("Relationship", "'Peace'"),
            tn.goto("StateChange.Store"),
            tn.display("StateChange.War.ToPeace.Reject", "No, you haven't learned your lesson yet."),
            tn.goto("StateCurrent.PromptAgain"),
            tn.display("StateChange.Peace.ToWar", "It is war, then.  You'll regret this."),
            tn.variableSet("Relationship", "'War'"),
            tn.goto("StateChange.Store"),
            tn.variableLoad("StateChange.Peace.ToAlliance", "Accepted", "Faction.fromEntity( cr.talker() ).diplomacy.shouldAcceptAllianceFrom( Faction.fromEntity( cr.player() ), u.world ).toString()"),
            tn._switch("Accepted", [
                ["true", "StateChange.Peace.ToAlliance.Accept"],
                ["false", "StateChange.Peace.ToAlliance.Reject"]
            ]),
            tn.display("StateChange.Peace.ToAlliance.Accept", "Yes, we are stronger together."),
            tn.variableSet("Relationship", "'Alliance'"),
            tn.goto("StateChange.Store"),
            tn.display("StateChange.Peace.ToAlliance.Reject", "We doubt that's in our interest."),
            tn.goto("StateCurrent.PromptAgain"),
            tn.display("StateChange.Alliance.ToPeace", "If that's really how you feel."),
            tn.variableSet("Relationship", "'Peace'"),
            tn.goto("StateChange.Store"),
            tn.variableStore("StateChange.Store", "Relationship", "Faction.fromEntity(cr.player()).diplomacy.relationshipByFactionName(Faction.fromEntity(cr.talker()).name).state"),
            tn.push("State.Set"),
            tn.goto("StateCurrent.PromptAgain"),
            tn.doNothing("TradeInformation.Push"),
            tn.push("TradeInformation.Prompt"),
            tn.goto("StateCurrent.PromptAgain"),
            tn.display("TradeInformation.Prompt", "What kind of info do you want to trade?"),
            tn.option("TradeInformation.Links.Option", "Let's trade info on star links.", "TradeInformation.Links.Do"),
            tn.option("TradeInformation.Starsystems.Option", "Let's trade info on starsystems.", "TradeInformation.Starsystems.Do"),
            tn.option("TradeInformation.Technologies.Option", "Let's trade technologies.", "TradeInformation.Technologies.Do"),
            tn.option("TradeInformation.Cancel.Option", "Never mind, I don't want to trade anymore.", "TradeInformation.Cancel.Do"),
            tn.prompt(),
            tn.doNothing("TradeInformation.Links.Do"),
            tn.script("(u, cr) => { /* todo */ }"),
            tn.goto("TradeInformation.Confirm"),
            tn.doNothing("TradeInformation.Starsystems.Do"),
            tn.script("(u, cr) => { /* todo */ }"),
            tn.goto("TradeInformation.Confirm"),
            tn.doNothing("TradeInformation.Technologies.Do"),
            tn.script("(u, cr) => { /* todo */ }"),
            tn.goto("TradeInformation.Confirm"),
            tn.display("TradeInformation.Confirm", "Very well, let's trade."),
            tn.display("TradeInformation.Confirm.Summary", "[Trade summary.]"),
            tn.goto("TradeInformation.Prompt"),
            tn.display("StateCurrent.PromptAgain", "Was there anything else?"),
            tn.goto("StateCurrent.Prompt.After"),
            tn.display("TradeInformation.Cancel.Do", "Very well, then."),
            tn.pop(),
            tn.variableLoad("State.Set", "Relationship", "Faction.fromEntity(cr.player()).diplomacy.relationshipByFactionName(Faction.fromEntity(cr.talker()).name).state"),
            tn.script("(u, cr) => { cr.nodesByPrefix('Greet.').forEach(x => cr.disable(x.name)); cr.nodesByPrefix('StateCurrent.').forEach(x => cr.disable(x.name)); }"),
            tn.script("(u, cr) => { var state = cr.varGet('Relationship'); cr.enable('Greet.' + state); cr.nodesByPrefix('StateCurrent.' + state).forEach(x => cr.enable(x.name)); }"),
            tn.script("(u, cr) => { cr.nodesByPrefix('StateCurrent.Quit').forEach(x => cr.enable(x.name)); }"),
            tn.script("(u, cr) => { cr.nodesByPrefix('StateCurrent.Prompt').forEach(x => cr.enable(x.name)); }"),
            tn.pop(),
            tn.display("Quit", "Until next time, then."),
            tn.quit()
        ];
        var returnConversationDefn = new ConversationDefn("Diplomacy", null, // contentTextStringName,
        new VisualNone(), // visualPortrait
        null, // soundMusicName
        TalkNodeDefn.Instances()._All, talkNodes);
        var contentNameOther = "Diplomacy_Others_" + this.communicationStyleName;
        var contentNames = [
            "Diplomacy_Player_Default",
            contentNameOther
        ];
        for (var c = 0; c < contentNames.length; c++) {
            var contentToSubstituteName = contentNames[c];
            var contentToSubstituteAsString = universe.mediaLibrary.textStringGetByName(contentToSubstituteName).value;
            var contentToSubstituteAsPairs = contentToSubstituteAsString.split("\n\n").map((x) => x.split("\n"));
            // todo - There must be a better way.
            var contentToSubstituteAsMap = new Map();
            for (var i = 0; i < contentToSubstituteAsPairs.length; i++) {
                var pair = contentToSubstituteAsPairs[i];
                contentToSubstituteAsMap.set(pair[0], pair[1]);
            }
            returnConversationDefn.contentSubstitute(contentToSubstituteAsMap);
        }
        return returnConversationDefn;
    }
}
