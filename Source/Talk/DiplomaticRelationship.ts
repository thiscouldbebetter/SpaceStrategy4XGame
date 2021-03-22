
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

	static initializeForFactions(factions: Faction[])
	{
		var statePeace = DiplomaticRelationship.States().Peace;

		for (var f = 0; f < factions.length; f++)
		{
			var factionThis = factions[f];

			for (var g = 0; g < f; g++)
			{
				var factionOther = factions[g];

				factionThis.relationships.push
				(
					new DiplomaticRelationship
					(
						factionOther.name, statePeace
					)
				);
				factionOther.relationships.push
				(
					new DiplomaticRelationship
					(
						factionThis.name, statePeace
					)
				);
			}
		}

		for (var f = 0; f < factions.length; f++)
		{
			var faction = factions[f];
			ArrayHelper.addLookups(faction.relationships, x => x.factionNameOther);
		}
	}

	static setStateForFactions(factions: Faction[], state: any)
	{
		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			var factionOther = factions[1 - i];

			faction.relationshipsByFactionName.get(factionOther.name).state = state;
		}

		return state;
	}

	static strengthOfFactions(world: WorldExtended, factions: Faction[])
	{
		var returnValue = 0;

		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			returnValue += faction.strength(world);
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
