"use strict";
class TalkSession {
    constructor(defn, factions) {
        this.defn = defn;
        this.factions = factions;
        var talkNodeStart = this.defn.talkNodes[0];
        this.scopeCurrent = new TalkScope(null, // parent
        talkNodeStart, 
        // talkNodesForOptions
        []);
        this._variablesByName = new Map();
        this.isTerminated = false;
        this.log = [];
    }
    // static methods
    static buildExample(factionActing, factionReceiving) {
        var factions = [factionActing, factionReceiving];
        var talkNodesAsStrings = [
            "program 	'RelationsState'	' return talkSession.factions[0].relationships[talkSession.factions[1].name].state; ' ",
            "set FactionName '" + factionReceiving.name + "' ",
            "display 	'Greetings.  We are the $FactionName$.' ",
            "label Subject",
            "display 	'What do you want to talk about?' ",
            "label SubjectOptions",
            "optionsClear",
            "ifGoto 	RelationsState	Peace 		SubjectOptions.PeaceOrAlliance ",
            "ifGoto 	RelationsState	Alliance 	SubjectOptions.PeaceOrAlliance ",
            "option		OfferPeace	'War is waste of everyone\"s resources.  Let there be peace between us.' ",
            "goto SubjectOptions.End",
            "label SubjectOptions.PeaceOrAlliance",
            "ifGoto		RelationsState	Alliance SubjectOptions.Alliance",
            "option 	DeclareWar 		'Your abuses have become intolerable.  We hereby declare war on you.' ",
            "option 	ProposeAlliance 	'Would you consider joining an alliance against our common enemies?' ",
            "goto SubjectOptions.End",
            "label SubjectOptions.Alliance",
            "option 	'TradeInfo' 		'As allies, would you like to trade information with us?' ",
            "option 	'CancelAlliance' 	'We regret to say that we can no longer participate in this alliance.' ",
            "label SubjectOptions.End",
            "option 	Quit 			'That\"s all for now.' ",
            "label SubjectPrompt",
            "prompt",
            "label OfferPeace",
            "program 	'PeaceOfferAccepted' ' return talkSession.factions[1].peaceOfferAcceptFrom(talkSession.factions[0]); ' ",
            "ifGoto 	'PeaceOfferAccepted' true 'OfferPeace.Accepted' ",
            "label OfferPeace.Accepted",
            "program 	'RelationsState'	' return DiplomaticRelationship.setStateForFactions(talkSession.factions, DiplomaticRelationship.States.Peace); ' ",
            "display	'We accept your offer of peace with relief.' ",
            "goto 		SubjectOptions",
            "label OfferPeace.Rejected",
            "display 	'Your pathetic begging notwitstanding, this war will continue.' ",
            "prompt",
            "label DeclareWar",
            "program 	OfferAppeasement 	' return talkSession.factions[1].warThreatOfferConcessionsTo(talkSession.factions[0]); ' ",
            "ifGoto 	OfferAppeasement 	null 	DeclareWar.Bargain ",
            "label DeclareWar.Acquiesce",
            "program 	RelationsState	' return DiplomaticRelationship.setStateForFactions(talkSession.factions, DiplomaticRelationship.States.War); ' ",
            "display 'War it is, then.  You will regret this unprovoked belligerence.' ",
            "goto SubjectOptions",
            "label DeclareWar.Bargain",
            "push",
            "display 	'Let us not be rash.  How can we change your mind?' ",
            "option 	DeclareWar.Bargain.Tech 	'We demand technological secrets.' ",
            "option 	DeclareWar.Bargain.Territory 	'We demand that you cede starsystems to us.' ",
            "option 	DeclareWar.Bargain.Refuse 	'There is nothing you can say that will blunt our resolve.' ",
            "prompt",
            "label DeclareWar.Bargain.Tech",
            "display 'Our secrets are our own, and shall remain so.' ",
            "prompt",
            "label DeclareWar.Bargain.Territory",
            "display 'You would threaten our territorial integrity?  We will never agree to this.' ",
            "prompt",
            "label DeclareWar.Bargain.Refuse",
            "display 'If you refuse to be even slightly reasonable about it...' ",
            "pop DeclareWar.Acquiesce",
            "label ProposeAlliance",
            "program 	AcceptAlliance ' return talkSession.factions[1].allianceProposalAcceptFrom(talkSession.factions[0]); ' ",
            "ifGoto 	AcceptAllance false ProposeAlliance.Reject",
            "label ProposeAlliance.Accept",
            "program 	RelationsState		' return DiplomaticRelationship.setStateForFactions(talkSession.factions, DiplomaticRelationship.States.Alliance); ' ",
            "display 	'Yes, the universe is a dangerous place.  Let us join forces.' ",
            "goto SubjectOptions",
            "label ProposeAlliance.Reject",
            "display 	'While we value your friendship, we wish to avoid such entanglements for now.' ",
            "prompt",
            "label CancelAlliance",
            "program 	RelationsState	' return DiplomaticRelationship.setStateForFactions(talkSession.factions, DiplomaticRelationship.States.Peace); ' ",
            "display 	'This is unfortunate news.  We shall miss being your comrades.' ",
            "goto SubjectOptions",
            "label TradeInfo",
            "push",
            "display 	'It depends on what you have to offer.' ",
            "display 	'What kind of information are you interested in trading?' ",
            "option 	TradeInfo.Tech 		'Let\"s trade technology.' ",
            "option 	TradeInfo.Maps 		'Let\"s compare maps.' ",
            "option 	TradeInfo.Factions 	'Can you offer any information on other factions?' ",
            "option 	TradeInfo.Exit		'That\"s all we\"d like to trade for now.' ",
            "prompt",
            "label TradeInfo.Factions",
            "display 'We embrace this opportunity to better know our neighbors.' ",
            "prompt",
            "label TradeInfo.Maps",
            "display 	'Yes, we would like to know what you know of this space we share.' ",
            "prompt",
            "label TradeInfo.Tech",
            "display 'The free exchange of scientific ideas enriches us both.' ",
            "prompt",
            "label TradeInfo.Exit",
            "display 'Very well.' ",
            "pop Subject ",
            "label Quit",
            "display 	'Until next time...' ",
            "display 	'[This conversation is over.]' ",
            "quit",
        ];
        var returnValue = TalkSession.fromStrings(factions, talkNodesAsStrings);
        return returnValue;
    }
    static fromStrings(factions, talkNodesAsStrings) {
        var talkNodes = [];
        for (var i = 0; i < talkNodesAsStrings.length; i++) {
            var talkNodeAsString = talkNodesAsStrings[i];
            var talkNode = TalkNode.fromString(talkNodeAsString);
            talkNodes.push(talkNode);
        }
        var talkDefn = new TalkDefn(TalkDefn.name, talkNodes);
        var talkSession = new TalkSession(talkDefn, factions);
        return talkSession;
    }
    // instance methods
    displayTextCurrent() {
        return this.scopeCurrent.displayTextCurrent;
    }
    hasResponseBeenSpecified() {
        var returnValue = ((this.optionsAvailable().length == 0)
            || (this.optionSelected != null));
        return returnValue;
    }
    optionsAvailable() {
        var returnValues = (this.scopeCurrent.areOptionsVisible ? this.scopeCurrent.talkNodesForOptions : []);
        return returnValues;
    }
    respond() {
        this.update();
    }
    start() {
        // todo
        //document.body.appendChild(this.htmlElementBuild());
        //this.update();
    }
    update() {
        this.scopeCurrent.update(this);
    }
    variableByName(variableName) {
        return this._variablesByName.get(variableName);
    }
    variableSet(variableName, variableValue) {
        return this._variablesByName.set(variableName, variableValue);
    }
}
