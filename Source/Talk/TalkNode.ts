
class TalkNode
{
	defn: TalkNodeDefn;
	parameters: any[];

	htmlElement: any;

	constructor(defn: TalkNodeDefn, parameters: any[])
	{
		this.defn = defn;
		this.parameters = parameters;
	}

	// constant

	static Underscore = "_"; // Prepended for array lookup in case name is numeric

	// static methods

	static fromString(stringToParse: string)
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
		var talkNodeDefn = TalkNodeDefn.byName(talkNodeDefnName);
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

	execute(talkSession: TalkSession, scope: TalkScope)
	{
		this.defn.execute(talkSession, scope, this);
	}

	text()
	{
		return this.parameters[1]; // hack
	}
}
