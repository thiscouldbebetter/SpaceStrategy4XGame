"use strict";
class StarCluster extends PlaceBase {
    constructor(name, nodes, links) {
        super(name, StarCluster.name, // defnName
        null, // parentName
        null, // size
        nodes // entities
        );
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
    static empty() {
        return new StarCluster("dummy", [], // nodes
        [] // links
        );
    }
    ;
    static generateRandom(universe, name, nodeDefns, numberOfNodes) {
        var randomizer = universe.randomizer;
        var nodesNotYetLinked = [];
        var radiusMin = .25;
        var radiusMax = 1;
        var radiusRange = radiusMax - radiusMin;
        var distanceBetweenNodesMin = .05;
        var nodePos = Coords.create();
        var displacementOfNodeNewFromOther = Coords.create();
        var minusOnes = new Coords(-1, -1, -1);
        var starNames = StarNames.Instance()._All;
        var starsystemNames = randomizer.chooseNElementsFromArray(numberOfNodes, starNames);
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
            var starsystemName = starsystemNames[i];
            var nodeStarsystem = Starsystem.generateRandom(universe, starsystemName);
            var node = new StarClusterNode(nodeStarsystem.name, nodeDefn, nodePos.clone(), nodeStarsystem.star, nodeStarsystem);
            nodesNotYetLinked.push(node);
        }
        var nodePositions = nodesNotYetLinked.map(x => x.locatable().loc.pos);
        var boundsActual = Box.create().containPoints(nodePositions);
        var boundsDesired = new Box(Coords.create(), // center
        Coords.ones().multiplyScalar(2 * radiusMax) // size
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
            var linkTypes = StarClusterLinkType.Instances();
            var probabilityLinkTypeIsNormalNotHard = .9;
            var randomFraction = randomizer.fraction();
            var linkType = randomFraction <= probabilityLinkTypeIsNormalNotHard
                ? linkTypes.Normal
                : linkTypes.Hard;
            var link = new StarClusterLink(linkType, [nodeToLink.name, nodeLinked.name]);
            links.push(link);
            nodesLinked.push(nodeToLink);
            ArrayHelper.remove(nodesNotYetLinked, nodeToLink);
            for (var i = 0; i < nodePairClosestSoFar.length; i++) {
                var node = nodePairClosestSoFar[i];
                var starsystem = node.starsystem;
                var starsystemSize = starsystem.size();
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
        var returnValue = new StarCluster(name, nodesLinked, links);
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
        if (placeType == StarClusterLink.name) {
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
    // Rounds.
    updateForRound(universe, world) {
        for (var i = 0; i < this.links.length; i++) {
            var link = this.links[i];
            link.updateForRound(universe, world);
        }
    }
    // drawing
    draw(universe, world, display) {
        throw new Error("Not yet implemented!");
    }
    draw2(universe, camera) {
        var drawPos = this.drawPos;
        var drawPosFrom = this.drawPosFrom;
        var drawPosTo = this.drawPosTo;
        var nodeRadiusActual = 4; // todo
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
        var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld(universe, universe.world);
        for (var i = 0; i < drawablesSortedByZ.length; i++) {
            var entity = drawablesSortedByZ[i];
            uwpe.entity = entity;
            var entityTypeName = entity.constructor.name;
            if (entityTypeName == StarClusterNode.name) {
                var node = entity;
                node.draw(uwpe);
            }
            else if (entityTypeName == Ship.name) {
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
        var returnValue = new StarCluster(this.name, nodesCloned, linksCloned);
        return returnValue;
    }
    // Controls.
    controlBuildTimeAndPlace(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var textPlace = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(universe, (c) => {
            // hack
            var venue = c.venueCurrent();
            return (venue.model == null ? "" : venue.model().name);
        }), fontNameAndHeight);
        var textRoundColonSpace = "Round:";
        var labelRound = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext(textRoundColonSpace), fontNameAndHeight);
        var textRound = ControlLabel.from4Uncentered(Coords.fromXY(margin + textRoundColonSpace.length * fontHeightInPixels * 0.45, margin + controlHeight), // pos
        Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
        DataBinding.fromContextAndGet(universe, (c) => "" + (c.world.roundsSoFar + 1)), fontNameAndHeight);
        var childControls = [
            textPlace,
            labelRound,
            textRound
        ];
        var buttonSize = Coords.fromXY(controlHeight, controlHeight);
        var world = universe.world;
        var buttonRoundNext = ControlButton.from5(Coords.fromXY(containerInnerSize.x - margin - buttonSize.x * 2, margin + controlHeight), // pos
        buttonSize, ">", // text,
        fontNameAndHeight, () => world.updateForRound(uwpe));
        var buttonRoundFastForward = ControlButton.from5(Coords.fromXY(containerInnerSize.x - margin - buttonSize.x, margin + controlHeight), // pos
        Coords.fromXY(controlHeight, controlHeight), // size,
        ">>", // text,
        fontNameAndHeight, () => world.roundAdvanceUntilNotificationToggle(uwpe));
        var roundAdvanceButtons = [
            buttonRoundNext,
            buttonRoundFastForward
        ];
        childControls.push(...roundAdvanceButtons);
        var size = Coords.fromXY(containerInnerSize.x, margin * 3 + controlHeight * 2);
        var returnValue = ControlContainer.from4("containerTimeAndPlace", Coords.fromXY(margin, margin), size, childControls);
        return returnValue;
    }
}
