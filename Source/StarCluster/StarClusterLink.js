"use strict";
class StarClusterLink {
    constructor(type, namesOfNodesLinked) {
        this.type = type;
        this.namesOfNodesLinked = namesOfNodesLinked;
        this.name = this.namesOfNodesLinked.join("-");
        this.ships = new Array();
    }
    static fromNamesOfNodesLinked(node0Name, node1Name) {
        var linkType = StarClusterLinkType.Instances().Normal;
        var link = new StarClusterLink(linkType, [node0Name, node1Name]);
        return link;
    }
    direction(cluster) {
        return this.displacement(cluster).normalize();
    }
    displacement(cluster) {
        var nodesLinked = this.nodesLinked(cluster);
        var node0Pos = nodesLinked[0].locatable().loc.pos;
        var node1Pos = nodesLinked[1].locatable().loc.pos;
        var returnValue = node1Pos.clone().subtract(node0Pos);
        return returnValue;
    }
    frictionDivisor() {
        return this.type.frictionDivisor;
    }
    length(cluster) {
        return this.displacement(cluster).magnitude();
    }
    nodesLinked(cluster) {
        var returnValue = [
            cluster.nodeByName(this.namesOfNodesLinked[0]),
            cluster.nodeByName(this.namesOfNodesLinked[1]),
        ];
        return returnValue;
    }
    shipAdd(shipToAdd) {
        this.ships.push(shipToAdd);
    }
    shipRemove(shipToRemove) {
        ArrayHelper.remove(this.ships, shipToRemove);
    }
    toEntity() {
        if (this._entity == null) {
            new Entity(this.name, [this]);
        }
        return this._entity;
    }
    // turns
    updateForRound(universe, world) {
        if (this.ships.length > 0) {
            var uwpe = new UniverseWorldPlaceEntities(universe, world, null, null, null);
            var cluster = world.starCluster;
            var nodesLinked = this.nodesLinked(cluster);
            var length = this.length(cluster);
            var direction = this.displacement(cluster).normalize();
            var shipsExitingLink = new Array();
            for (var i = 0; i < this.ships.length; i++) {
                var ship = this.ships[i];
                var shipLoc = ship.locatable().loc;
                var shipPos = shipLoc.pos;
                var shipVel = shipLoc.vel;
                var shipAsDeviceUser = ship.deviceUser();
                var shipSpeedBeforeFriction = shipAsDeviceUser.speedThroughLink(ship);
                var frictionDivisor = this.type.frictionDivisor;
                var shipSpeed = shipSpeedBeforeFriction / frictionDivisor;
                shipVel = shipVel.clone().multiplyScalar(shipSpeed);
                shipPos.add(shipVel);
                var isShipMovingForward = (shipVel.dotProduct(direction) > 0);
                var nodeIndexFrom = (isShipMovingForward ? 0 : 1);
                var nodeFrom = nodesLinked[nodeIndexFrom];
                var nodeFromPos = nodeFrom.locatable().loc.pos;
                var distanceAlongLink = shipPos.clone().subtract(nodeFromPos).magnitude();
                if (distanceAlongLink >= length) {
                    shipsExitingLink.push(ship);
                }
            }
            for (var i = 0; i < shipsExitingLink.length; i++) {
                var ship = shipsExitingLink[i];
                ship.linkExit(this, uwpe);
            }
        }
    }
    // drawable
    color() {
        return this.type.color;
    }
    draw(universe, camera, nodeRadiusActual, drawPosFrom, drawPosTo) {
        var cluster = universe.world.starCluster;
        var nodesLinked = this.nodesLinked(cluster);
        var nodeFromPos = nodesLinked[0].locatable().loc.pos;
        var nodeToPos = nodesLinked[1].locatable().loc.pos;
        camera.coordsTransformWorldToView(drawPosFrom.overwriteWith(nodeFromPos));
        camera.coordsTransformWorldToView(drawPosTo.overwriteWith(nodeToPos));
        if (drawPosFrom.z <= 0 || drawPosTo.z <= 0) {
            return; // hack - todo - Clipping.
        }
        var directionFromNode0To1InView = drawPosTo.clone().subtract(drawPosFrom).normalize();
        var perpendicular = directionFromNode0To1InView.clone().right().half();
        var perspectiveFactorFrom = camera.focalLength / drawPosFrom.z;
        var perspectiveFactorTo = camera.focalLength / drawPosTo.z;
        var radiusApparentFrom = nodeRadiusActual * perspectiveFactorFrom;
        var radiusApparentTo = nodeRadiusActual * perspectiveFactorTo;
        var display = universe.display;
        display.drawPolygon([
            perpendicular.clone().multiplyScalar(0 - radiusApparentFrom).add(drawPosFrom),
            perpendicular.clone().multiplyScalar(0 - radiusApparentTo).add(drawPosTo),
            perpendicular.clone().multiplyScalar(radiusApparentTo).add(drawPosTo),
            perpendicular.clone().multiplyScalar(radiusApparentFrom).add(drawPosFrom)
        ], this.color(), // hack
        null);
    }
    // Clonable.
    clone() {
        return new StarClusterLink(this.type, this.namesOfNodesLinked.slice());
    }
    overwriteWith(other) {
        return this;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable
    equals(other) { return false; }
}
class StarClusterLinkType {
    constructor(name, frictionDivisor, color) {
        this.name = name;
        this.frictionDivisor = frictionDivisor;
        this.color = color;
    }
    static Instances() {
        if (StarClusterLinkType._instances == null) {
            StarClusterLinkType._instances = new StarClusterLinkType_Instances();
        }
        return StarClusterLinkType._instances;
    }
    static byName(name) {
        return StarClusterLinkType.Instances().byName(name);
    }
}
class StarClusterLinkType_Instances {
    constructor() {
        var colors = Color.Instances();
        this.Normal = new StarClusterLinkType("Normal", 1, colors.Gray.clone().alphaSet(.4));
        this.Hard = new StarClusterLinkType("Hard", 5, colors.Red.clone().alphaSet(.4));
        this._All = [this.Normal, this.Hard];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
