
interface FactionKnowledgeTrade
{
	execute(world: WorldExtended): void;
	isValid(): boolean;
	toStringDescription(): string;
}

class FactionKnowledgeTrade_Links
{
	factions: Faction[];
	linksToTradeByFaction: NetworkLink2[];

	constructor
	(
		factions: Faction[],
		linksToTradeByFaction: NetworkLink2[]
	)
	{
		this.factions = factions;
		this.linksToTradeByFaction = linksToTradeByFaction;
	}

	execute(world: WorldExtended): void
	{
		// todo
	}

	isValid(): boolean
	{
		return this.linksToTradeByFaction.some(x => x == null) == false;
	}

	toStringDescription(): string
	{
		var returnValue =
			"The " + this.factions[0].name
			+ " revealed link " + this.linksToTradeByFaction[0].name
			+ " to the " + this.factions[1].name
			+ " in exchange for " + this.linksToTradeByFaction[1].name;

		return returnValue;
	}
}

class FactionKnowledgeTrade_Starsystems
{
	factions: Faction[];
	starsystemsToTradeByFaction: Starsystem[];

	constructor
	(
		factions: Faction[],
		starsystemsToTradeByFaction: Starsystem[]
	)
	{
		this.factions = factions;
		this.starsystemsToTradeByFaction = starsystemsToTradeByFaction;
	}

	execute(world: WorldExtended): void
	{
		// todo
	}

	isValid(): boolean
	{
		return this.starsystemsToTradeByFaction.some(x => x == null) == false;
	}

	toStringDescription(): string
	{
		var returnValue =
			"The " + this.factions[0].name
			+ " revealed starsystem " + this.starsystemsToTradeByFaction[0].name
			+ " to the " + this.factions[1].name
			+ " in exchange for " + this.starsystemsToTradeByFaction[1].name;

		return returnValue;
	}
}

class FactionKnowledgeTrade_Technologies
{
	factions: Faction[];
	technologiesToTradeByFaction: Technology[];

	constructor
	(
		factions: Faction[],
		technologiesToTradeByFaction: Technology[]
	)
	{
		this.factions = factions;
		this.technologiesToTradeByFaction = technologiesToTradeByFaction;
	}

	execute(world: WorldExtended): void
	{
		// todo
	}

	isValid(): boolean
	{
		return this.technologiesToTradeByFaction.some(x => x == null) == false;
	}

	toStringDescription(): string
	{
		var returnValue =
			"The " + this.factions[0].name
			+ " revealed technology " + this.technologiesToTradeByFaction[0].name
			+ " to the " + this.factions[1].name
			+ " in exchange for " + this.technologiesToTradeByFaction[1].name;

		return returnValue;
	}
}