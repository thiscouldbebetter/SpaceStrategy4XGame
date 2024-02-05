
class FactionTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	faction: Faction;
	factionOther: Faction;

	constructor()
	{
		super(FactionTests.name);
		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		this.faction = this.world.factions()[0];
		this.factionOther = this.world.factions()[1];
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.fromDefnName,
			this.planetHome,
			this.researchSessionStart,
			this.starsystemHome,
			this.toString,
			this.toControl_ClusterOverlay,
			this.allies,
			this.enemies,
			this.factionsMatchingRelationshipState,
			this.relationshipByFactionName,
			this.selfAndAllies,
			this.strategicValue,
			this.notificationSessionStart,
			this.researchThisRound,
			this.updateForTurn
		];

		return returnTests;
	}

	// Tests.

	fromDefnName(): void
	{
		var defn = FactionDefn.Instances()._All[0];
		var faction = Faction.fromDefnName(defn.name);
		Assert.isNotNull(faction);
	}

	planetHome(): void
	{
		var planet = this.faction.planetHome(this.world);
		Assert.isNotNull(planet);
	}

	researchSessionStart(): void
	{
		this.faction.researchSessionStart(this.universe);
	}

	starsystemHome(): void
	{
		var starsystem = this.faction.starsystemHome(this.world);
		Assert.isNotNull(starsystem);
	}

	toString(): void
	{
		var factionAsString = this.faction.toString();
		Assert.isNotNull(factionAsString);
	}

	// controls

	toControl_ClusterOverlay(): void
	{
		var factionAsControl = this.faction.toControl_ClusterOverlay
		(
			this.universe,
			this.universe.display.sizeInPixels, // containerMainSize,
			this.universe.display.sizeInPixels.clone().half(), // containerInnerSize
			10, // margin,
			10, // controlHeight,
			20, // buttonWidth
			true // includeDetailsButton
		);
		Assert.isNotNull(factionAsControl);
	}

	// diplomacy

	allies(): void
	{
		var allies = this.faction.allies(this.world);
		Assert.isTrue(allies.length == 0);
	}

	enemies(): void
	{
		var enemies = this.faction.enemies(this.world);
		Assert.isTrue(enemies.length == 0);
	}

	factionsMatchingRelationshipState(): void
	{
		var factions = this.faction.factionsMatchingRelationshipState
		(
			this.world, DiplomaticRelationshipState.Instances().Peace
		)
		Assert.isNotNull(factions);
	}

	relationshipByFactionName(): void
	{
		var relationship =
			this.faction.relationshipByFactionName(this.factionOther.name);
		Assert.isNull(relationship);
	}

	selfAndAllies(): void
	{
		var selfAndAllies = this.faction.selfAndAllies(this.world);
		Assert.isNotNull(selfAndAllies);
	}

	strategicValue(): void
	{
		var strategicValue = this.faction.strategicValue(this.world);
		Assert.isNotNull(strategicValue);
	}

	// notifications

	notificationSessionStart(): void
	{
		this.faction.notificationSessionStart(this.universe, Coords.zeroes() );
	}

	// turns

	researchThisRound(): void
	{
		var researchThisRound =
			this.faction.researchThisRound(this.universe, this.world);
		Assert.isNotNull(researchThisRound);
	}

	updateForTurn(): void
	{
		this.faction.updateForRound(this.universe, this.world);
	}
}
