
class TalkScope
{
	constructor(parent, talkNodeCurrent, talkNodesForOptions)
	{
		this.parent = parent;
		this.talkNodeCurrent = talkNodeCurrent;
		this.talkNodesForOptions = talkNodesForOptions;

		this.displayTextCurrent = "";
		this.areOptionsVisible = false;
	}

	talkNodeAdvance(talkSession)
	{
		var talkNodeIndex = talkSession.defn.talkNodes.indexOf(this.talkNodeCurrent);
		var talkNodeNext = talkSession.defn.talkNodes[talkNodeIndex + 1];
		this.talkNodeCurrent = talkNodeNext;
	}

	update(talkSession)
	{
		this.talkNodeCurrent.execute(talkSession, this);
	}
}
