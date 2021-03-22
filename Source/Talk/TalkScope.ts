
class TalkScope
{
	parent: TalkScope;
	talkNodeCurrent: TalkNode;
	talkNodesForOptions: TalkNode[];

	displayTextCurrent: string;
	areOptionsVisible: boolean;

	constructor
	(
		parent: TalkScope,
		talkNodeCurrent: TalkNode,
		talkNodesForOptions: TalkNode[]
	)
	{
		this.parent = parent;
		this.talkNodeCurrent = talkNodeCurrent;
		this.talkNodesForOptions = talkNodesForOptions;

		this.displayTextCurrent = "";
		this.areOptionsVisible = false;
	}

	talkNodeAdvance(talkSession: TalkSession)
	{
		var talkNodeIndex = talkSession.defn.talkNodes.indexOf(this.talkNodeCurrent);
		var talkNodeNext = talkSession.defn.talkNodes[talkNodeIndex + 1];
		this.talkNodeCurrent = talkNodeNext;
	}

	update(talkSession: TalkSession)
	{
		this.talkNodeCurrent.execute(talkSession, this);
	}
}
