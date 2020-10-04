
class DiplomaticRelationship
{
	constructor(factionNameOther, state)
	{
		this.factionNameOther = factionNameOther;
		this.state = state;
	}

	// static methods

	static initializeForFactions(factions)
	{
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
						factionOther.name,
						DiplomaticRelationship.States.Peace
					)
				);
				factionOther.relationships.push
				(
					new DiplomaticRelationship
					(
						factionThis.name,
						DiplomaticRelationship.States.Peace
					)
				);
			}
		}

		for (var f = 0; f < factions.length; f++)
		{
			var faction = factions[f];
			faction.relationships.addLookups( function(x) { return x.factionNameOther; } );
		}
	}

	static setStateForFactions(factions, state)
	{
		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			var factionOther = factions[1 - i];

			faction.relationships[factionOther.name].state = state;
		}

		return state;
	}

	static strengthOfFactions(factions)
	{
		var returnValue = 0;

		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			returnValue += faction.strength();
		}

		return returnValue;
	}

	// instances

	static States()
	{
		if (DiplomaticRelationship._states == null)
		{
			DiplomaticRelationship._states = new DiplomaticRelationship_States();
		}
		return DiplomaticRelationship._states;
	}

	// instance methods

	factionOther(universe)
	{
		return universe.factions[this.factionNameOther];
	}

	toString()
	{
		var returnValue = this.factionNameOther + ":" + this.state;
		return returnValue;
	}
}

class DiplomaticRelationship_States
{
	constructor()
	{
		this.Alliance = "Alliance";
		this.Peace = "Peace";
		this.War = "War";
	}
}
