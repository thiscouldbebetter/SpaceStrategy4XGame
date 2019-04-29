
function TalkNodeDefn(name, execute)
{
	this.name = name;
	this.execute = execute;
}

{
	// instances

	TalkNodeDefn.Instances = new TalkNodeDefn_Instances();

	function TalkNodeDefn_Instances()
	{
		this.Display = new TalkNodeDefn
		(
			"display",
			// execute
			function(talkSession, scope, talkNode)
			{
				scope.areOptionsVisible = false;
				var textToDisplay = talkNode.parameters[0];

				var textToDisplaySplit = textToDisplay.split("$");
				for (var i = 1; i < textToDisplaySplit.length; i += 2)
				{
					var variableName = textToDisplaySplit[i];
					var variableValue = talkSession.variableLookup[variableName];
					textToDisplaySplit[i] = variableValue;

				}
				textToDisplay = textToDisplaySplit.join("");
				talkSession.log.push(talkSession.factions[1] + ": " + textToDisplay);

				scope.displayTextCurrent = textToDisplay;
				scope.talkNodeAdvance(talkSession);

			}
		);

		this.Goto = new TalkNodeDefn
		(
			"goto",
			// execute
			function(talkSession, scope, talkNode)
			{
				scope.talkNodeCurrent = talkSession.defn.talkNodeByLabel
				(
					talkNode.parameters[0]
				);

				talkSession.update();
			}
		);

		this.IfGoto = new TalkNodeDefn
		(
			"ifGoto",
			// execute
			function(talkSession, scope, talkNode)
			{
				var parameters = talkNode.parameters;
				var variableName = parameters[0];
				var variableValueToMatch = parameters[1];
				if (variableValueToMatch == "null")
				{
					variableValueToMatch = null;
				}

				var variableValueActual = talkSession.variableLookup[variableName];
				if (variableValueActual != null)
				{
					variableValueActual = variableValueActual.toString();
				}

				if (variableValueActual == variableValueToMatch)
				{
					var nameOfDestinationNode = parameters[2];

					scope.talkNodeCurrent = talkSession.defn.talkNodeByLabel
					(
						nameOfDestinationNode
					);
				}
				else
				{
					scope.talkNodeAdvance(talkSession);
				}

				talkSession.update();
			}
		);

		this.Label = new TalkNodeDefn
		(
			"label",
			// execute
			function(talkSession, scope, talkNode)
			{
				// do nothing
				scope.talkNodeAdvance(talkSession);
				talkSession.update();
			}
		);

		this.Option = new TalkNodeDefn
		(
			"option",
			// execute
			function(talkSession, scope, talkNode)
			{
				scope.talkNodesForOptions.push
				(
					talkNode
				);

				scope.talkNodeAdvance(talkSession);

				talkSession.update();
			}
		);

		this.OptionsClear = new TalkNodeDefn
		(
			"optionsClear",
			// execute
			function(talkSession, scope, talkNode)
			{
				scope.talkNodesForOptions.clear();

				scope.talkNodeAdvance(talkSession);

				talkSession.update();
			}
		);

		this.Pop = new TalkNodeDefn
		(
			"pop",
			function(talkSession, scope, talkNode)
			{
				var scope = scope.parent;
				talkSession.scopeCurrent = scope;

				scope.talkNodeCurrent = talkSession.defn.talkNodeByLabel
				(
					talkNode.parameters[0]
				);

				talkSession.update();
			}
		);

		this.Program = new TalkNodeDefn
		(
			"program",
			function(talkSession, scope, talkNode)
			{
				var parameters = talkNode.parameters;
				var variableNameForReturnValue = parameters[0];
				var programAsText = parameters[1];

				var program = new Function
				(
					"talkSession", "scope", "talkNode",
					programAsText
				);
				var returnValue = program(talkSession, scope, talkNode);
				talkSession.variableLookup[variableNameForReturnValue] = returnValue;

				scope.talkNodeAdvance(talkSession);
				talkSession.update();
			}
		);

		this.Prompt = new TalkNodeDefn
		(
			"prompt",
			function(talkSession, scope, talkNode)
			{
				var optionSelected = talkSession.optionSelected;
				if (optionSelected == null)
				{
					scope.areOptionsVisible = true;
				}
				else
				{
					talkSession.log.push(talkSession.factions[0].name + ":" + optionSelected.parameters[1]);
					talkSession.optionSelected = null;
					var nameOfTalkNodeNext = optionSelected.parameters[0];
					var talkNodeNext = talkSession.defn.talkNodeByLabel(nameOfTalkNodeNext);
					scope.talkNodeCurrent = talkNodeNext;
					talkSession.update();
				}
			}
		);

		this.Push = new TalkNodeDefn
		(
			"push",
			function(talkSession, scope, talkNode)
			{
				var runDefn = talkSession.defn;
				var talkNodeIndex = runDefn.talkNodes.indexOf(talkNode);
				var talkNodeNext = runDefn.talkNodes[talkNodeIndex + 1];

				talkSession.scopeCurrent = new TalkScope
				(
					scope, // parent
					talkNodeNext,
					[] // options
				);

				talkSession.update();
			}
		);

		this.Quit = new TalkNodeDefn
		(
			"quit",
			function(talkSession, scope, talkNode)
			{
				talkSession.isTerminated = true;
				// todo
			}
		);


		this.Set = new TalkNodeDefn
		(
			"set",
			function(talkSession, scope, talkNode)
			{
				var parameters = talkNode.parameters;
				var variableName = parameters[0];
				var variableValueToSet = parameters[1];
				if (variableValueToSet == "null")
				{
					variableValueToSet = null;
				}

				talkSession.variableLookup[variableName] = variableValueToSet;

				scope.talkNodeAdvance(talkSession);
				talkSession.update();
			}
		);

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
			this.Quit,
		];
		this._All.addLookups("name");
	}
}
