"use strict";
class Network2Tests extends TestFixture {
    constructor() {
        super(Network2Tests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.network = this.networkBuildRandom();
        this.display = DisplayTest.default();
    }
    networkBuildRandom() {
        var nodeDefns = StarClusterNodeDefn.Instances()._All;
        var numberOfNodes = 12;
        var network = StarCluster.generateRandom(this.universe, "[networkName]", nodeDefns, numberOfNodes);
        return network;
    }
    // Tests.
    tests() {
        var returnValues = [
            this.generateRandom,
            this.linkByStarsystemNamesFromTo,
            this.nodesAsEntities,
            this.scale,
            this.updateForTurn,
            this.draw
        ];
        return returnValues;
    }
    generateRandom() {
        Assert.isNotNull(this.network);
    }
    linkByStarsystemNamesFromTo() {
        var network = this.network;
        var starsystemFromName = network.nodes[0].name;
        var linksFromStarsystemFromByName = network.linksByStarsystemNamesFromTo.get(starsystemFromName);
        var starsystemToName = linksFromStarsystemFromByName.keys().next().value;
        var link = network.linkByStarsystemNamesFromTo(starsystemFromName, starsystemToName);
        Assert.isNotNull(link);
    }
    nodesAsEntities() {
        var nodesAsEntities = this.network.nodesAsEntities();
        Assert.isNotNull(nodesAsEntities);
        Assert.areNumbersEqual(this.network.nodes.length, nodesAsEntities.length);
    }
    scale() {
        var networkBeforeScaling = this.networkBuildRandom();
        var node0PosBeforeScaling = networkBeforeScaling.nodes[0].locatable().loc.pos;
        var scaleFactor = 2;
        var networkAfterDoubling = networkBeforeScaling.clone().scale(scaleFactor);
        var node0PosAfterDoubling = networkAfterDoubling.nodes[0].locatable().loc.pos;
        Assert.isFalse(node0PosBeforeScaling.equals(node0PosAfterDoubling));
        var networkAfterDoublingThenHalving = networkAfterDoubling.clone().scale(1 / scaleFactor);
        var node0PosAfterDoublingThenHalving = networkAfterDoublingThenHalving.nodes[0].locatable().loc.pos;
        Assert.isTrue(node0PosBeforeScaling.equals(node0PosAfterDoublingThenHalving));
    }
    // turns
    updateForTurn() {
        var universe = this.universe;
        var world = universe.world;
        this.network.updateForRound(universe, world);
    }
    // drawing
    draw() {
        var world = this.universe.world;
        var networkFromUniverse = world.starCluster; // hack - Not this.network.
        networkFromUniverse.draw(this.universe, world, this.display);
    }
}
