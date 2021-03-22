"use strict";
class TalkNodeDefn {
    constructor(name, execute) {
        this.name = name;
        this.execute = execute;
    }
    static Instances() {
        if (TalkNodeDefn._instances == null) {
            TalkNodeDefn._instances = new TalkNodeDefn_Instances();
        }
        return TalkNodeDefn._instances;
    }
    static byName(talkNodeDefnName) {
        return TalkNodeDefn.Instances()._AllByName.get(talkNodeDefnName);
    }
}
class TalkNodeDefn_Instances {
    constructor() {
        this.Display = new TalkNodeDefn("display", 
        // execute
        (talkSession, scope, talkNode) => {
            scope.areOptionsVisible = false;
            var textToDisplay = talkNode.parameters[0];
            var textToDisplaySplit = textToDisplay.split("$");
            for (var i = 1; i < textToDisplaySplit.length; i += 2) {
                var variableName = textToDisplaySplit[i];
                var variableValue = talkSession.variableByName(variableName);
                textToDisplaySplit[i] = variableValue;
            }
            textToDisplay = textToDisplaySplit.join("");
            talkSession.log.push(talkSession.factions[1] + ": " + textToDisplay);
            scope.displayTextCurrent = textToDisplay;
            scope.talkNodeAdvance(talkSession);
        });
        this.Goto = new TalkNodeDefn("goto", 
        // execute
        (talkSession, scope, talkNode) => {
            scope.talkNodeCurrent = talkSession.defn.talkNodeByLabel(talkNode.parameters[0]);
            talkSession.update();
        });
        this.IfGoto = new TalkNodeDefn("ifGoto", 
        // execute
        (talkSession, scope, talkNode) => {
            var parameters = talkNode.parameters;
            var variableName = parameters[0];
            var variableValueToMatch = parameters[1];
            if (variableValueToMatch == "null") {
                variableValueToMatch = null;
            }
            var variableValueActual = talkSession.variableByName(variableName);
            if (variableValueActual != null) {
                variableValueActual = variableValueActual.toString();
            }
            if (variableValueActual == variableValueToMatch) {
                var nameOfDestinationNode = parameters[2];
                scope.talkNodeCurrent = talkSession.defn.talkNodeByLabel(nameOfDestinationNode);
            }
            else {
                scope.talkNodeAdvance(talkSession);
            }
            talkSession.update();
        });
        this.Label = new TalkNodeDefn("label", 
        // execute
        (talkSession, scope, talkNode) => {
            // do nothing
            scope.talkNodeAdvance(talkSession);
            talkSession.update();
        });
        this.Option = new TalkNodeDefn("option", 
        // execute
        (talkSession, scope, talkNode) => {
            scope.talkNodesForOptions.push(talkNode);
            scope.talkNodeAdvance(talkSession);
            talkSession.update();
        });
        this.OptionsClear = new TalkNodeDefn("optionsClear", 
        // execute
        (talkSession, scope, talkNode) => {
            scope.talkNodesForOptions.length = 0;
            scope.talkNodeAdvance(talkSession);
            talkSession.update();
        });
        this.Pop = new TalkNodeDefn("pop", (talkSession, scope, talkNode) => {
            var scope = scope.parent;
            talkSession.scopeCurrent = scope;
            scope.talkNodeCurrent = talkSession.defn.talkNodeByLabel(talkNode.parameters[0]);
            talkSession.update();
        });
        this.Program = new TalkNodeDefn("program", (talkSession, scope, talkNode) => {
            var parameters = talkNode.parameters;
            var variableNameForReturnValue = parameters[0];
            var programAsText = parameters[1];
            var program = new Function("talkSession", "scope", "talkNode", programAsText);
            var returnValue = program(talkSession, scope, talkNode);
            talkSession.variableSet(variableNameForReturnValue, returnValue);
            scope.talkNodeAdvance(talkSession);
            talkSession.update();
        });
        this.Prompt = new TalkNodeDefn("prompt", (talkSession, scope, talkNode) => {
            var optionSelected = talkSession.optionSelected;
            if (optionSelected == null) {
                scope.areOptionsVisible = true;
            }
            else {
                talkSession.log.push(talkSession.factions[0].name + ":" + optionSelected.parameters[1]);
                talkSession.optionSelected = null;
                var nameOfTalkNodeNext = optionSelected.parameters[0];
                var talkNodeNext = talkSession.defn.talkNodeByLabel(nameOfTalkNodeNext);
                scope.talkNodeCurrent = talkNodeNext;
                talkSession.update();
            }
        });
        this.Push = new TalkNodeDefn("push", (talkSession, scope, talkNode) => {
            var runDefn = talkSession.defn;
            var talkNodeIndex = runDefn.talkNodes.indexOf(talkNode);
            var talkNodeNext = runDefn.talkNodes[talkNodeIndex + 1];
            talkSession.scopeCurrent = new TalkScope(scope, // parent
            talkNodeNext, [] // options
            );
            talkSession.update();
        });
        this.Quit = new TalkNodeDefn("quit", (talkSession, scope, talkNode) => {
            talkSession.isTerminated = true;
            // todo
        });
        this.Set = new TalkNodeDefn("set", (talkSession, scope, talkNode) => {
            var parameters = talkNode.parameters;
            var variableName = parameters[0];
            var variableValueToSet = parameters[1];
            if (variableValueToSet == "null") {
                variableValueToSet = null;
            }
            talkSession.variableSet(variableName, variableValueToSet);
            scope.talkNodeAdvance(talkSession);
            talkSession.update();
        });
        this._All =
            [
                this.Display,
                this.Goto,
                this.IfGoto,
                this.Label,
                this.Option,
                this.OptionsClear,
                this.Pop,
                this.Program,
                this.Prompt,
                this.Push,
                this.Set,
                this.Quit
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
