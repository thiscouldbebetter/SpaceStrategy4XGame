
class TalkNode
{
	constructor(defn, parameters)
	{
		this.defn = defn;
		this.parameters = parameters;
	}

	// constant

	static Underscore = "_"; // Prepended for array lookup in case name is numeric

	// static methods

	static fromString(stringToParse)
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

		var talkNodeDefns = TalkNodeDefn.Instances()._All;

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
				ArrayHelper.removeAt(stringAsTokens, i);
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
	}

	// instance methods

	click(talkSession, scope)
	{
		if (this.defn.click != null)
		{
			this.defn.click(talkSession, scope, this);
		}
	}

	execute(talkSession, scope)
	{
		this.defn.execute(talkSession, scope, this);
	}

	htmlElementBuild(talkSession)
	{
		var returnValue = document.createElement("div");
		returnValue.innerHTML = this.parameters;
		returnValue.talkSession = talkSession;
		returnValue.onclick = TalkNode.handleClickEvent;

		returnValue.talkNode = this;
		this.htmlElement = returnValue;

		return returnValue;
	}

	text()
	{
		return this.parameters[1]; // hack
	}
}
