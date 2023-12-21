
class DiplomaticRelationship
{
	_factionOther: Faction;
	state: DiplomaticRelationshipState;

	constructor(factionOther: Faction, state: DiplomaticRelationshipState)
	{
		this._factionOther = factionOther;
		this.state = state || DiplomaticRelationship.States().Uncontacted;
	}

	static fromFactionOther(factionOther: Faction): DiplomaticRelationship
	{
		return new DiplomaticRelationship(factionOther, null);
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

	static _states: DiplomaticRelationshipState_Instances;
	static States(): DiplomaticRelationshipState_Instances
	{
		return DiplomaticRelationshipState.Instances();
	}

	// instance methods

	factionOther(): Faction
	{
		return this._factionOther;
	}

	stateIsWar(): boolean
	{
		return (this.state == DiplomaticRelationship.States().War);
	}

	stateSet(value: DiplomaticRelationshipState): void
	{
		this.state = value;
	}

	stateSetToAlliance(): void
	{
		this.state = DiplomaticRelationship.States().Alliance;
	}

	stateSetToPeace(): void
	{
		this.state = DiplomaticRelationship.States().Peace;
	}

	stateSetToWar(): void
	{
		this.state = DiplomaticRelationship.States().War;
	}

	toString()
	{
		var returnValue = this.factionOther().name + ":" + this.state;
		return returnValue;
	}
}

class DiplomaticRelationshipState
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: DiplomaticRelationshipState_Instances;
	static Instances(): DiplomaticRelationshipState_Instances
	{
		if (DiplomaticRelationshipState._instances == null)
		{
			DiplomaticRelationshipState._instances =
				new DiplomaticRelationshipState_Instances();
		}
		return DiplomaticRelationshipState._instances;
	}

	static byName(name: string): DiplomaticRelationshipState
	{
		return DiplomaticRelationshipState.Instances().byName(name);
	}
}

class DiplomaticRelationshipState_Instances
{
	Alliance: DiplomaticRelationshipState;
	Peace: DiplomaticRelationshipState;
	Uncontacted: DiplomaticRelationshipState;
	War: DiplomaticRelationshipState;

	_All: DiplomaticRelationshipState[];

	constructor()
	{
		this.Alliance = new DiplomaticRelationshipState("Alliance");
		this.Peace = new DiplomaticRelationshipState("Peace");
		this.Uncontacted = new DiplomaticRelationshipState("Uncontacted");
		this.War = new DiplomaticRelationshipState("War");

		this._All =
		[
			this.Alliance,
			this.Peace,
			this.Uncontacted,
			this.War
		];
	}

	byName(name: string): DiplomaticRelationshipState
	{
		return this._All.find(x => x.name == name);
	}
}
