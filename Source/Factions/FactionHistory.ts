
class FactionHistory
{
	factionName: string;
	events: FactionHistoryEvent[];

	constructor(factionName: string, events: FactionHistoryEvent[])
	{
		this.factionName = factionName;
		this.events = events;
	}

	eventAdd(eventToAdd: FactionHistoryEvent): FactionHistory
	{
		this.events.push(eventToAdd);
		return this;
	}

	reputation(world: WorldExtended): number
	{
		var factionReputation = 0;

		this.events.forEach
		(
			event =>
			{
				var eventReputation = event.reputation(world);
				factionReputation += eventReputation;
			}
		);

		return factionReputation;
	}
}

class FactionHistoryEvent
{
	turnOfOccurrence: number;
	defn: FactionHistoryEventDefn;
	factionOther: Faction;
	location: Disposition;

	constructor
	(
		turnOfOccurrence: number,
		defn: FactionHistoryEventDefn,
		factionOther: Faction,
		location: Disposition
	)
	{
		this.turnOfOccurrence = turnOfOccurrence;
		this.defn = defn;
		this.factionOther = factionOther;
		this.location = location;
	}

	reputation(world: WorldExtended): number
	{
		var returnValue = this.defn.reputationForEvent(world, this);
		return returnValue;
	}
}

class FactionHistoryEventDefn
{
	name: string;
	_reputationForEvent: (w: WorldExtended, e: FactionHistoryEvent) => number

	constructor
	(
		name: string,
		reputationForEvent: (w: WorldExtended, e: FactionHistoryEvent) => number
	)
	{
		this.name = name;
		this._reputationForEvent = reputationForEvent;
	}

	static _instances: FactionHistoryEventDefn_Instances;
	static Instances(): FactionHistoryEventDefn_Instances
	{
		if (FactionHistoryEventDefn._instances == null)
		{
			FactionHistoryEventDefn._instances =
				new FactionHistoryEventDefn_Instances();
		}

		return FactionHistoryEventDefn._instances;
	}

	reputationForEvent
	(
		world: WorldExtended, event: FactionHistoryEvent
	): number
	{
		var returnValue =
		(
			this._reputationForEvent == null
			? 0
			: this._reputationForEvent(world, event)
		);

		return returnValue;
	}
}

class FactionHistoryEventDefn_Instances
{
	AllianceWithdrawn: FactionHistoryEventDefn;
	AlliedWith: FactionHistoryEventDefn;
	Extortion: FactionHistoryEventDefn;
	IllegalSettlement: FactionHistoryEventDefn;
	PlanetAttack: FactionHistoryEventDefn;
	PlanetInvasion: FactionHistoryEventDefn;
	PropertyDestruction: FactionHistoryEventDefn;
	ShipAttack: FactionHistoryEventDefn;
	ShipDestruction: FactionHistoryEventDefn;
	SneakAttack: FactionHistoryEventDefn;
	WarDeclared: FactionHistoryEventDefn;

	_All: FactionHistoryEventDefn[];

	constructor()
	{
		this.AllianceWithdrawn  = new FactionHistoryEventDefn("AllianceWithdrawn", null);
		this.AlliedWith  		= new FactionHistoryEventDefn("AlliedWith", null);
		this.Extortion 			= new FactionHistoryEventDefn("Extortion", null);
		this.IllegalSettlement 	= new FactionHistoryEventDefn("IllegalSettlement", null);
		this.PlanetAttack 		= new FactionHistoryEventDefn("PlanetAttack", null);
		this.PlanetInvasion 	= new FactionHistoryEventDefn("PlanetInvasion", null);
		this.PropertyDestruction = new FactionHistoryEventDefn("PropertyDestruction", null);
		this.ShipAttack 		= new FactionHistoryEventDefn("ShipAttack", null);
		this.ShipDestruction 	= new FactionHistoryEventDefn("ShipDestruction", null);
		this.SneakAttack 		= new FactionHistoryEventDefn("SneakAttack", null);
		this.WarDeclared  		= new FactionHistoryEventDefn("WarDeclared", null);

		this._All =
		[
			this.AllianceWithdrawn,
			this.AlliedWith,
			this.Extortion,
			this.IllegalSettlement,
			this.PlanetAttack,
			this.PlanetInvasion,
			this.PropertyDestruction,
			this.ShipAttack,
			this.ShipDestruction,
			this.SneakAttack,
			this.WarDeclared
		];
	}
}