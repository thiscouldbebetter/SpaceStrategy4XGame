
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
		this.faction = this.world.factions[0];
		this.factionOther = this.world.factions[1];
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.fromName,
			this.planetHome,
			this.researchSessionStart,
			this.starsystemHome,
			this.toString,
			this.toControl,
			this.allianceProposalAcceptFrom,
			this.allies,
			this.enemies,
			this.factionsMatchingRelationshipState,
			this.peaceOfferAcceptFrom,
			this.relationsInitialize,
			this.relationshipByFactionName,
			this.selfAndAllies,
			this.strength,
			this.warThreatOfferConcessionsTo,
			this.notificationSessionStart,
			this.researchPerTurn,
			this.updateForTurn
		];

		return returnTests;
	}

	// Tests.

	fromName(): void
	{
		var faction = Faction.fromName("Faction");
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

	toControl(): void
	{
		var factionAsControl = this.faction.toControl
		(
			this.universe,
			this.universe.display.sizeInPixels, // containerMainSize,
			this.universe.display.sizeInPixels.clone().half(), // containerInnerSize
			10, // margin,
			10, // controlHeight,
			20 // buttonWidth
		);
		Assert.isNotNull(factionAsControl);
	}

	toControl_Intelligence(): void
	{
		var diplomaticSession = DiplomaticSession.demo
		(
			this.faction,
			[ this.faction, this.factionOther ],
			null // venueParent
		);

		var factionAsControl = Faction.toControl_Intelligence
		(
			diplomaticSession,
			new Coords(0, 0, 0), // pos,
			this.universe.display.sizeInPixels // containerSize
		);
		Assert.isNotNull(factionAsControl);
	}

	// diplomacy

	allianceProposalAcceptFrom(): void
	{
		var result =
			this.faction.allianceProposalAcceptFrom(this.factionOther);
		Assert.isTrue(result);
	}

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
			this.world, "todo" // stateToMatch
		)
		Assert.isNotNull(factions);
	}

	peaceOfferAcceptFrom(): void
	{
		var result = this.faction.peaceOfferAcceptFrom(this.factionOther);
		Assert.isTrue(result);
	}

	relationsInitialize(): void
	{
		this.faction.relationsInitialize(this.universe);
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

	strength(): void
	{
		var strength = this.faction.strength(this.world);
		Assert.isNotNull(strength);
	}

	warThreatOfferConcessionsTo(): void
	{
		var result = this.faction.warThreatOfferConcessionsTo(this.factionOther);
		Assert.isTrue(result);
	}

	// notifications

	notificationSessionStart(): void
	{
		this.faction.notificationSessionStart(this.universe);
	}

	// turns

	researchPerTurn(): void
	{
		var researchPerTurn =
			this.faction.researchPerTurn(this.universe, this.world);
		Assert.isNotNull(researchPerTurn);
	}

	updateForTurn(): void
	{
		this.faction.updateForTurn(this.universe, this.world);
	}
}
