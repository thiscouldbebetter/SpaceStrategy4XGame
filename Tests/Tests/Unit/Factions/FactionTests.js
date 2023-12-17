"use strict";
class FactionTests extends TestFixture {
    constructor() {
        super(FactionTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        this.faction = this.world.factions[0];
        this.factionOther = this.world.factions[1];
    }
    tests() {
        var returnTests = [
            this.fromName,
            this.planetHome,
            this.researchSessionStart,
            this.starsystemHome,
            this.toString,
            this.toControl_ClusterOverlay,
            this.allies,
            this.enemies,
            this.factionsMatchingRelationshipState,
            this.relationsInitialize,
            this.relationshipByFactionName,
            this.selfAndAllies,
            this.strategicValue,
            this.notificationSessionStart,
            this.researchPerTurn,
            this.updateForTurn
        ];
        return returnTests;
    }
    // Tests.
    fromName() {
        var faction = Faction.fromName("Faction");
        Assert.isNotNull(faction);
    }
    planetHome() {
        var planet = this.faction.planetHome(this.world);
        Assert.isNotNull(planet);
    }
    researchSessionStart() {
        this.faction.researchSessionStart(this.universe);
    }
    starsystemHome() {
        var starsystem = this.faction.starsystemHome(this.world);
        Assert.isNotNull(starsystem);
    }
    toString() {
        var factionAsString = this.faction.toString();
        Assert.isNotNull(factionAsString);
    }
    // controls
    toControl_ClusterOverlay() {
        var factionAsControl = this.faction.toControl_ClusterOverlay(this.universe, this.universe.display.sizeInPixels, // containerMainSize,
        this.universe.display.sizeInPixels.clone().half(), // containerInnerSize
        10, // margin,
        10, // controlHeight,
        20, // buttonWidth
        true // includeDetailsButton
        );
        Assert.isNotNull(factionAsControl);
    }
    // diplomacy
    allies() {
        var allies = this.faction.allies(this.world);
        Assert.isTrue(allies.length == 0);
    }
    enemies() {
        var enemies = this.faction.enemies(this.world);
        Assert.isTrue(enemies.length == 0);
    }
    factionsMatchingRelationshipState() {
        var factions = this.faction.factionsMatchingRelationshipState(this.world, "todo" // stateToMatch
        );
        Assert.isNotNull(factions);
    }
    relationsInitialize() {
        this.faction.relationsInitialize(this.universe);
    }
    relationshipByFactionName() {
        var relationship = this.faction.relationshipByFactionName(this.factionOther.name);
        Assert.isNull(relationship);
    }
    selfAndAllies() {
        var selfAndAllies = this.faction.selfAndAllies(this.world);
        Assert.isNotNull(selfAndAllies);
    }
    strategicValue() {
        var strategicValue = this.faction.strategicValue(this.world);
        Assert.isNotNull(strategicValue);
    }
    // notifications
    notificationSessionStart() {
        this.faction.notificationSessionStart(this.universe);
    }
    // turns
    researchPerTurn() {
        var researchPerTurn = this.faction.researchPerTurn(this.universe, this.world);
        Assert.isNotNull(researchPerTurn);
    }
    updateForTurn() {
        this.faction.updateForRound(this.universe, this.world);
    }
}
