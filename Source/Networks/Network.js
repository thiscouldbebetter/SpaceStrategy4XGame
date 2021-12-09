"use strict";
class Network2 //
 {
    constructor(name, nodes, links) {
        this.name = name;
        this.nodes = nodes;
        this.links = links;
        this.nodesByName = ArrayHelper.addLookupsByName(this.nodes);
        this.linksByName = ArrayHelper.addLookupsByName(this.links);
        this.linksByStarsystemNamesFromTo = new Map();
        for (var i = 0; i < this.links.length; i++) {
            var link = this.links[i];
            var namesOfNodesLinked = link.namesOfNodesLinked;
            for (var n = 0; n < namesOfNodesLinked.length; n++) {
                var nameOfNodeFrom = namesOfNodesLinked[n];
                var nameOfNodeTo = namesOfNodesLinked[1 - n];
                if (this.linksByStarsystemNamesFromTo.has(nameOfNodeFrom) == false) {
                    var linksOriginatingAtNodeFrom = new Map();
                    this.linksByStarsystemNamesFromTo.set(nameOfNodeFrom, linksOriginatingAtNodeFrom);
                }
                var linksOriginatingAtNodeFrom = this.linksByStarsystemNamesFromTo.get(nameOfNodeFrom);
                linksOriginatingAtNodeFrom.set(nameOfNodeTo, link);
            }
        }
        // Helper variables.
        this.drawPos = Coords.create();
        this.drawPosFrom = Coords.create();
        this.drawPosTo = Coords.create();
    }
    static generateRandom(universe, name, nodeDefns, numberOfNodes) {
        var nodesNotYetLinked = [];
        var radiusMin = .25;
        var radiusMax = 1;
        var radiusRange = radiusMax - radiusMin;
        var distanceBetweenNodesMin = .05;
        var nodePos = Coords.create();
        var displacementOfNodeNewFromOther = Coords.create();
        var minusOnes = new Coords(-1, -1, -1);
        for (var i = 0; i < numberOfNodes; i++) {
            var distanceOfNodeNewFromExisting = 0;
            while (distanceOfNodeNewFromExisting < distanceBetweenNodesMin) {
                nodePos.randomize(universe.randomizer).double().add(minusOnes).normalize().multiplyScalar(radiusMin + radiusRange * Math.random());
                distanceOfNodeNewFromExisting = distanceBetweenNodesMin;
                for (var j = 0; j < i; j++) {
                    var nodeOther = nodesNotYetLinked[j];
                    var nodeOtherPos = nodeOther.locatable().loc.pos;
                    displacementOfNodeNewFromOther.overwriteWith(nodePos).subtract(nodeOtherPos);
                    var distanceOfNodeNewFromOther = displacementOfNodeNewFromOther.magnitude();
                    if (distanceOfNodeNewFromOther < distanceBetweenNodesMin) {
                        distanceOfNodeNewFromExisting = distanceOfNodeNewFromOther;
                        break;
                    }
                }
            }
            var nodeDefnIndexRandom = Math.floor(nodeDefns.length * Math.random());
            var nodeDefn = nodeDefns[nodeDefnIndexRandom];
            var nodeStarsystem = Starsystem.generateRandom(universe);
            var node = new NetworkNode2(nodeStarsystem.name, nodeDefn, nodePos.clone(), nodeStarsystem);
            nodesNotYetLinked.push(node);
        }
        var nodePositions = nodesNotYetLinked.map(x => x.locatable().loc.pos);
        var boundsActual = new Box(Coords.create(), Coords.create()).ofPoints(nodePositions);
        var boundsDesired = new Box(Coords.create(), // center
        new Coords(1, 1, 1).multiplyScalar(2 * radiusMax) // size
        );
        var boundsActualSizeHalf = boundsActual.sizeHalf();
        var boundsDesiredSizeHalf = boundsDesired.sizeHalf();
        for (var i = 0; i < nodePositions.length; i++) {
            var nodePos = nodePositions[i];
            nodePos.subtract(boundsActual.center);
            nodePos.divide(boundsActualSizeHalf).multiply(boundsDesiredSizeHalf);
        }
        var nodesLinked = [nodesNotYetLinked[0]];
        ArrayHelper.removeAt(nodesNotYetLinked, 0);
        var links = [];
        var bodyDefnLinkPortal = LinkPortal.bodyDefn();
        var tempPos = Coords.create();
        while (nodesLinked.length < numberOfNodes) {
            var nodePairClosestSoFar = null;
            var distanceBetweenNodePairClosestSoFar = 4; // hack
            for (var i = 0; i < nodesLinked.length; i++) {
                var nodeLinked = nodesLinked[i];
                var nodeLinkedPos = nodeLinked.locatable().loc.pos;
                for (var j = 0; j < nodesNotYetLinked.length; j++) {
                    var nodeToLink = nodesNotYetLinked[j];
                    var distanceBetweenNodes = tempPos.overwriteWith(nodeLinkedPos).subtract(nodeToLink.locatable().loc.pos).magnitude();
                    if (distanceBetweenNodes <= distanceBetweenNodePairClosestSoFar) {
                        distanceBetweenNodePairClosestSoFar = distanceBetweenNodes;
                        nodePairClosestSoFar = [nodeToLink, nodeLinked];
                    }
                }
            }
            var nodeToLink = nodePairClosestSoFar[0];
            var nodeLinked = nodePairClosestSoFar[1];
            var link = new NetworkLink2([
                nodeToLink.name,
                nodeLinked.name
            ]);
            links.push(link);
            nodesLinked.push(nodeToLink);
            ArrayHelper.remove(nodesNotYetLinked, nodeToLink);
            for (var i = 0; i < nodePairClosestSoFar.length; i++) {
                var node = nodePairClosestSoFar[i];
                var starsystem = node.starsystem;
                var starsystemSize = starsystem.size;
                var starsystemOther = nodePairClosestSoFar[1 - i];
                var linkName = "Link to " + starsystemOther.name;
                var linkPortal = new LinkPortal(linkName, bodyDefnLinkPortal, Coords.create().randomize(universe.randomizer).multiply(starsystemSize).multiplyScalar(2).subtract(starsystemSize), 
                // starsystemNamesFromAndTo
                [
                    starsystem.name,
                    starsystemOther.name
                ]);
                starsystem.linkPortalAdd(linkPortal);
                //starsystemPortalsByStarsystemName.set(starsystemOther.name, linkPortal);
            }
        }
        var returnValue = new Network2(name, nodesLinked, links);
        return returnValue;
    }
    linkByName(linkName) {
        return this.linksByName.get(linkName);
    }
    linkByStarsystemNamesFromTo(starsystemFromName, starsystemToName) {
        return this.linksByStarsystemNamesFromTo.get(starsystemFromName).get(starsystemToName);
    }
    nodeByName(nodeName) {
        return this.nodesByName.get(nodeName);
    }
    nodesAsEntities() {
        if (this._nodesAsEntities == null) {
            this._nodesAsEntities = this.nodes.map(x => new Entity(x.name, [x, x.locatable()]));
        }
        return this._nodesAsEntities;
    }
    placeForEntityLocatable(entityLocatable) {
        var returnPlace = null;
        var placeTypeColonName = entityLocatable.locatable().loc.placeName;
        var placeTypeAndName = placeTypeColonName.split(":");
        var placeType = placeTypeAndName[0];
        var placeName = placeTypeAndName[1];
        if (placeType == NetworkLink2.name) {
            returnPlace = this.linkByName(placeName);
        }
        else if (placeType == Planet.name) {
            var starsystemName = placeName.split(" ")[0];
            var starsystem = this.starsystemByName(starsystemName);
            returnPlace = starsystem.planetByName(placeName);
        }
        else if (placeType == Starsystem.name) {
            returnPlace = this.starsystemByName(placeName);
        }
        return returnPlace;
    }
    scale(scaleFactor) {
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            node.locatable().loc.pos.multiplyScalar(scaleFactor);
        }
        return this;
    }
    starsystemByName(starsystemName) {
        return this.nodesByName.get(starsystemName).starsystem;
    }
    // turns
    updateForTurn(universe, world) {
        for (var i = 0; i < this.links.length; i++) {
            var link = this.links[i];
            link.updateForTurn(universe, world);
        }
    }
    // drawing
    draw(universe, camera) {
        var drawPos = this.drawPos;
        var drawPosFrom = this.drawPosFrom;
        var drawPosTo = this.drawPosTo;
        var nodeRadiusActual = NetworkNode2.RadiusActual();
        var shipsInLinks = new Array();
        for (var i = 0; i < this.links.length; i++) {
            var link = this.links[i];
            link.draw(universe, camera, nodeRadiusActual, drawPosFrom, drawPosTo);
            shipsInLinks = shipsInLinks.concat(link.ships);
        }
        var drawablesToSort = shipsInLinks.concat(this.nodes);
        var drawablesSortedByZ = new Array();
        for (var i = 0; i < drawablesToSort.length; i++) {
            var drawableToSort = drawablesToSort[i];
            camera.coordsTransformWorldToView(drawPos.overwriteWith(drawableToSort.locatable().loc.pos));
            if (drawPos.z > 0) {
                var j;
                for (j = 0; j < drawablesSortedByZ.length; j++) {
                    var drawableSorted = drawablesSortedByZ[j];
                    var drawableSortedPos = drawableSorted.locatable().loc.pos.clone();
                    var drawableSortedDrawPos = camera.coordsTransformWorldToView(drawableSortedPos);
                    if (drawPos.z >= drawableSortedDrawPos.z) {
                        break;
                    }
                }
                ArrayHelper.insertElementAt(drawablesSortedByZ, drawableToSort, j);
            }
        }
        for (var i = 0; i < drawablesSortedByZ.length; i++) {
            var entity = drawablesSortedByZ[i];
            var node = entity;
            if (node != null) {
                node.draw(universe, nodeRadiusActual, camera);
            }
            else {
                var ship = entity;
                if (ship != null) {
                    ship.draw(universe, nodeRadiusActual, camera, this.drawPos);
                }
            }
        }
    }
    // Clonable.
    clone() {
        var nodesCloned = this.nodes.map(x => x.clone());
        var linksCloned = ArrayHelper.clone(this.links);
        var returnValue = new Network2(this.name, nodesCloned, linksCloned);
        return returnValue;
    }
}
