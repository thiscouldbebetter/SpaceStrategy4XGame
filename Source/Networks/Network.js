"use strict";
class Network2 {
    constructor(name, nodes, links) {
        this.name = name;
        this.nodes = nodes;
        this.links = links;
        this.nodes = nodes;
        this.nodesByName = ArrayHelper.addLookupsByName(this.nodes);
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
    static generateRandom(universe, name, nodeDefns, numberOfNodes, minAndMaxDistanceOfNodesFromOrigin, distanceBetweenNodesMin) {
        var nodesNotYetLinked = [];
        var radiusMinAndMax = minAndMaxDistanceOfNodesFromOrigin;
        var radiusMin = radiusMinAndMax[0];
        var radiusMax = radiusMinAndMax[1];
        var radiusRange = radiusMax - radiusMin;
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
        var bodyDefnLinkPortal = new BodyDefn("LinkPortal", Coords.fromXY(10, 10), // size
        new VisualGroup([
            new VisualCircleGradient(10, // radius
            new ValueBreakGroup([
                new ValueBreak(0, Color.byName("Black")),
                new ValueBreak(.5, Color.byName("Black")),
                new ValueBreak(.75, Color.byName("Violet")),
                new ValueBreak(1, Color.byName("Blue"))
            ], null // interpolationMode
            ))
        ]));
        var tempPos = Coords.create();
        while (nodesLinked.length < numberOfNodes) {
            var nodePairClosestSoFar = null;
            var distanceBetweenNodePairClosestSoFar = minAndMaxDistanceOfNodesFromOrigin[1] * 4;
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
    linkByStarsystemNamesFromTo(starsystemFromName, starsystemToName) {
        return this.linksByStarsystemNamesFromTo.get(starsystemFromName).get(starsystemToName);
    }
    nodesAsEntities() {
        if (this._nodesAsEntities == null) {
            this._nodesAsEntities = this.nodes.map(x => new Entity(x.name, [x, x.locatable()]));
        }
        return this._nodesAsEntities;
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
            var drawableToSort = drawablesToSort[i].toEntity();
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
            var node = EntityExtensions.networkNode(entity);
            if (node != null) {
                node.draw(universe, nodeRadiusActual, camera);
            }
            else {
                var ship = EntityExtensions.ship(entity);
                if (ship != null) {
                    ship.draw(universe, nodeRadiusActual, camera, this.drawPos);
                }
            }
        }
    }
}
