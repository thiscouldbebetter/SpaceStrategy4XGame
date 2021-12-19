
class DiplomaticRelationship
{
	factionNameOther: string;
	state: string;

	constructor(factionNameOther: string, state: string)
	{
		this.factionNameOther = factionNameOther;
		this.state = state;
	}

	// static methods

	static strengthOfFactions(world: WorldExtended, factions: Faction[])
	{
		var returnValue = 0;

		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			returnValue += faction.strategicValue(world);
		}

		return returnValue;
	}

	// instances

	static _states: DiplomaticRelationship_States;
	static States()
	{
		if (DiplomaticRelationship._states == null)
		{
			DiplomaticRelationship._states = new DiplomaticRelationship_States();
		}
		return DiplomaticRelationship._states;
	}

	// instance methods

	factionOther(world: WorldExtended)
	{
		return world.factionByName(this.factionNameOther);
	}

	toString()
	{
		var returnValue = this.factionNameOther + ":" + this.state;
		return returnValue;
	}
}

class DiplomaticRelationship_States
{
	Alliance: string;
	Peace: string;
	War: string;

	constructor()
	{
		this.Alliance = "Alliance";
		this.Peace = "Peace";
		this.War = "War";
	}
}
