
class FactionIntelligence
{
	name: string;
	chooseMove: (u: Universe) => void;

	constructor(name: string, chooseMove: (u: Universe) => void)
	{
		this.name = name;
		this.chooseMove = chooseMove;
	}

	static demo(): FactionIntelligence
	{
		return new FactionIntelligence
		(
			"Demo",
			FactionIntelligence.demoChooseMove
		)
	}

	static demoChooseMove(universe: Universe): void
	{
		// todo
	}
}