"use strict";
class TalkDefn {
    constructor(name, talkNodes) {
        this.name = name;
        this.talkNodes = talkNodes;
        for (var i = 0; i < this.talkNodes.length; i++) {
            var talkNode = this.talkNodes[i];
            if (talkNode.defn.name == "label") {
                var label = talkNode.parameters[0];
                var talkNodeName = TalkNode.Underscore + label;
                this.talkNodesByName.set(talkNodeName, talkNode);
            }
        }
    }
    talkNodeByLabel(nameOfTalkNodeToGet) {
        var talkNodeName = TalkNode.Underscore + nameOfTalkNodeToGet;
        return this.talkNodesByName.get(talkNodeName);
    }
}
