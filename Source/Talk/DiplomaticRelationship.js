
function DiplomaticRelationship(factionNameOther, state)
{
	this.factionNameOther = factionNameOther;
	this.state = state;
}

{
	// static methods

	DiplomaticRelationship.initializeForFactions = function(factions)
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
	};

	DiplomaticRelationship.setStateForFactions = function(factions, state)
	{
		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			var factionOther = factions[1 - i];

			faction.relationships[factionOther.name].state = state;
		}

		return state;
	};

	DiplomaticRelationship.strengthOfFactions = function(factions)
	{
		var returnValue = 0;

		for (var i = 0; i < factions.length; i++)
		{
			var faction = factions[i];
			returnValue += faction.strength();
		}

		return returnValue;
	};

	// instances

	function DiplomaticRelationship_States()
	{
		this.Alliance = "Alliance";
		this.Peace = "Peace";
		this.War = "War";
	};

	DiplomaticRelationship.States = new DiplomaticRelationship_States();

	// instance methods

	DiplomaticRelationship.prototype.factionOther = function(universe)
	{
		return universe.factions[this.factionNameOther];
	};

	DiplomaticRelationship.prototype.toString = function()
	{
		var returnValue = this.factionNameOther + ":" + this.state;
		return returnValue;
	};
}
