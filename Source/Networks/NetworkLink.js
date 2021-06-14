"use strict";
class NetworkLink2 {
    constructor(namesOfNodesLinked) {
        this.namesOfNodesLinked = namesOfNodesLinked;
        this.ships = new Array();
        this.name = this.namesOfNodesLinked.join("-");
        this.color = Color.fromSystemColor("rgba(128, 128, 128, .4)"); // hack
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
    length(cluster) {
        return this.displacement(cluster).magnitude();
    }
    nodesLinked(cluster) {
        var returnValue = [
            cluster.nodesByName.get(this.namesOfNodesLinked[0]),
            cluster.nodesByName.get(this.namesOfNodesLinked[1]),
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
    updateForTurn(universe, world) {
        if (this.ships.length > 0) {
            var cluster = world.network;
            var nodesLinked = this.nodesLinked(cluster);
            var length = this.length(cluster);
            var direction = this.displacement(cluster).normalize();
            var shipsExitingLink = new Array();
            for (var i = 0; i < this.ships.length; i++) {
                var ship = this.ships[i];
                var shipLoc = ship.locatable().loc;
                var shipPos = shipLoc.pos;
                var shipVel = shipLoc.vel;
                var shipSpeed = ship.movementThroughLinkPerTurn(this);
                shipPos.add(shipVel.clone().multiplyScalar(shipSpeed));
                var isShipMovingForward = (shipVel.dotProduct(direction) > 0);
                var nodeIndexFrom = (isShipMovingForward ? 0 : 1);
                var nodeFrom = nodesLinked[nodeIndexFrom];
                var distanceAlongLink = shipPos.clone().subtract(nodeFrom.locatable().loc.pos).magnitude();
                if (distanceAlongLink >= length) {
                    shipsExitingLink.push(ship);
                }
            }
            for (var i = 0; i < shipsExitingLink.length; i++) {
                var ship = shipsExitingLink[i];
                ship.linkExit(world, this);
            }
        }
    }
    // drawable
    draw(universe, camera, nodeRadiusActual, drawPosFrom, drawPosTo) {
        var cluster = universe.world.network;
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
        ], this.color, // hack
        null);
    }
    // Clonable.
    clone() {
        return new NetworkLink2(this.namesOfNodesLinked.slice());
    }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
