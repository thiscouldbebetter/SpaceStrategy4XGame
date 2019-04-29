
function TalkNode(defn, parameters)
{
	this.defn = defn;
	this.parameters = parameters;
}

{
	// constant

	TalkNode.Underscore = "_"; // Prepended for array lookup in case name is numeric

	// static methods

	TalkNode.fromString = function(stringToParse)
	{
		var returnValue = null;

		stringToParse = stringToParse.trim();
		var stringSplitOnQuotes = stringToParse.split("'");

		for (var i = 1; i < stringSplitOnQuotes.length; i += 2)
		{
			var stringLiteral = stringSplitOnQuotes[i];
			stringLiteral = stringLiteral.split(" ").join("_");
			stringSplitOnQuotes[i] = stringLiteral;
		}

		stringToParse = stringSplitOnQuotes.join("'");
		stringToParse = stringToParse.split("\t").join(" ");

		var talkNodeDefns = TalkNodeDefn.Instances._All;

		var stringAsTokens = stringToParse.trim().split(" ");
		for (var i = 0; i < stringAsTokens.length; i++)
		{
			var token = stringAsTokens[i];

			token = token.split("_").join(" ");
			token = token.split("'").join("");
			token = token.split("\"").join("'");
			stringAsTokens[i] = token;

			if (token == "")
			{
				stringAsTokens.removeAt(i);
				i--;
			}
		}

		var talkNodeDefnName = stringAsTokens[0];
		var talkNodeDefn = talkNodeDefns[talkNodeDefnName];
		if (talkNodeDefn == null)
		{
			throw "Unrecognized command.";
		}
		else
		{
			var parameters = stringAsTokens.slice(1);

			returnValue = new TalkNode
			(
				talkNodeDefn,
				parameters
			)
		}

		return returnValue;
	};

	// instance methods

	TalkNode.prototype.click = function(talkSession, scope)
	{
		if (this.defn.click != null)
		{
			this.defn.click(talkSession, scope, this);
		}
	};

	TalkNode.prototype.execute = function(talkSession, scope)
	{
		this.defn.execute(talkSession, scope, this);
	};

	TalkNode.prototype.htmlElementBuild = function(talkSession)
	{
		var returnValue = document.createElement("div");
		returnValue.innerHTML = this.parameters;
		returnValue.talkSession = talkSession;
		returnValue.onclick = TalkNode.handleClickEvent;

		returnValue.talkNode = this;
		this.htmlElement = returnValue;

		return returnValue;
	};

	TalkNode.prototype.text = function()
	{
		return this.parameters[1]; // hack
	};
}
