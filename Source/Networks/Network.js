
function Network(name, nodes, links)
{
	this.name = name;
	this.nodes = nodes;
	this.links = links;

	this.nodes.addLookups("name");

	for (var i = 0; i < this.links.length; i++)
	{
		var link = this.links[i];
		var namesOfNodesLinked = link.namesOfNodesLinked;

		for (var n = 0; n < namesOfNodesLinked.length; n++)
		{
			var nameOfNodeFrom = namesOfNodesLinked[n];
			var nameOfNodeTo = namesOfNodesLinked[1 - n];

			var linksOriginatingAtNodeFrom = this.links[nameOfNodeFrom];
			if (linksOriginatingAtNodeFrom == null)
			{
				linksOriginatingAtNodeFrom = [];
				this.links[nameOfNodeFrom] = linksOriginatingAtNodeFrom;
			}

			linksOriginatingAtNodeFrom[nameOfNodeTo] = link;
		}
	}

	// Helper variables.
	this.drawPos = new Coords();
	this.drawPosFrom = new Coords();
	this.drawPosTo = new Coords();
}

{
	Network.generateRandom = function
	(
		universe,
		name, 
		nodeDefns, 
		numberOfNodes, 
		minAndMaxDistanceOfNodesFromOrigin, 
		distanceBetweenNodesMin
	)
	{
		var nodesNotYetLinked = [];

		var radiusMinAndMax = minAndMaxDistanceOfNodesFromOrigin;
		var radiusMin = radiusMinAndMax[0]; 
		var radiusMax = radiusMinAndMax[1];
		var radiusRange = radiusMax - radiusMin; 

		var nodePos = new Coords(0, 0, 0);
		var displacementOfNodeNewFromOther = new Coords(0, 0, 0);
		var minusOnes = new Coords(-1, -1, -1);

		for (var i = 0; i < numberOfNodes; i++)
		{
			var distanceOfNodeNewFromExisting = 0;

			while (distanceOfNodeNewFromExisting < distanceBetweenNodesMin)
			{
				nodePos.randomize().multiplyScalar(2).add
				(
					minusOnes
				).normalize().multiplyScalar
				(
					radiusMin + radiusRange * Math.random()
				);

				distanceOfNodeNewFromExisting = distanceBetweenNodesMin;

				for (var j = 0; j < i; j++)
				{
					var nodeOtherPos = nodesNotYetLinked[j].loc.pos;
					 
					displacementOfNodeNewFromOther.overwriteWith
					(
						nodePos
					).subtract
					(
						nodeOtherPos
					);

					var distanceOfNodeNewFromOther = 
						displacementOfNodeNewFromOther.magnitude();

					if (distanceOfNodeNewFromOther < distanceBetweenNodesMin)
					{
						distanceOfNodeNewFromExisting = distanceOfNodeNewFromOther;
						break;
					}
				}
			}

			var nodeDefnIndexRandom = Math.floor(nodeDefns.length * Math.random());
			var nodeDefn = nodeDefns[nodeDefnIndexRandom];
			var nodeStarsystem = Starsystem.generateRandom(universe);

			var node = new NetworkNode
			(
				nodeStarsystem.name,
				nodeDefn,
				nodePos.clone(),
				nodeStarsystem
			);

			nodesNotYetLinked.push(node);
		}

		var nodePositions = nodesNotYetLinked.elementProperties("loc").elementProperties("pos");
		var boundsActual = new Bounds(new Coords(), new Coords()).ofPoints(nodePositions);
		var boundsDesired = new Bounds
		(
			new Coords(0, 0, 0), // center
			new Coords(1, 1, 1).multiplyScalar(2 * radiusMax) // size
		)
		for (var i = 0; i  < nodePositions.length; i++)
		{
			var nodePos = nodePositions[i];
			nodePos.subtract(boundsActual.center);
			nodePos.divide(boundsActual.sizeHalf).multiply(boundsDesired.sizeHalf);
		}

		var nodesLinked = [ nodesNotYetLinked[0] ];
		nodesNotYetLinked.removeAt(0);
		var links = [];
		var colors = Color.Instances();

		var bodyDefnLinkPortal = new BodyDefn
		(
			"LinkPortal", 
			new Coords(10, 10), // size
			new VisualGroup
			([
				new VisualCircleGradient
				(
					10, // radius
					new Gradient
					([
						new GradientStop(0, "Black"),
						new GradientStop(.5, "Black"),
						new GradientStop(.75, "Violet"),
						new GradientStop(1, "Blue"),
					])
				)
			])
		);

		var tempPos = new Coords(0, 0, 0);

		while (nodesLinked.length < numberOfNodes)
		{
			var nodePairClosestSoFar = null;
			var distanceBetweenNodePairClosestSoFar = minAndMaxDistanceOfNodesFromOrigin[1] * 4;

			for (var i = 0; i < nodesLinked.length; i++)
			{
				var nodeLinked = nodesLinked[i];
				var nodeLinkedPos = nodeLinked.loc.pos;

				for (var j = 0; j < nodesNotYetLinked.length; j++)
				{
					var nodeToLink = nodesNotYetLinked[j];

					var distanceBetweenNodes = tempPos.overwriteWith
					(
						nodeLinkedPos
					).subtract
					(
						nodeToLink.loc.pos
					).magnitude();

					if (distanceBetweenNodes <= distanceBetweenNodePairClosestSoFar)
					{
						distanceBetweenNodePairClosestSoFar = distanceBetweenNodes;
						nodePairClosestSoFar = [nodeToLink, nodeLinked];
					}
				}
			}

			var nodeToLink = nodePairClosestSoFar[0];
			var nodeLinked = nodePairClosestSoFar[1];

			var link = new NetworkLink
			([ 
				nodeToLink.name,
				nodeLinked.name
			]);
			var linkIndex = links.length;
			links.push(link);
			nodesLinked.push(nodeToLink);
			nodesNotYetLinked.remove(nodeToLink);

			for (var i = 0; i < nodePairClosestSoFar.length; i++)
			{
				var node = nodePairClosestSoFar[i];
				var starsystem = node.starsystem;
				var starsystemSize = starsystem.size;
				var starsystemOther = nodePairClosestSoFar[1 - i];
				var linkName = "Link to " + starsystemOther.name;

				var linkPortal = new LinkPortal
				(
					linkName,
					bodyDefnLinkPortal,
					new Coords().randomize().multiply
					(
						starsystemSize
					).multiplyScalar
					(
						2
					).subtract
					(
						starsystemSize
					),
					// starsystemNamesFromAndTo
					[
						starsystem.name,
						starsystemOther.name
					]
				);

				var starsystemPortals = starsystem.linkPortals;
				starsystemPortals.push(linkPortal);
				starsystemPortals[starsystemOther.name] = linkPortal;
			};
		}

		var returnValue = new Network
		(
			name,
			nodesLinked,
			links
		);

		return returnValue;
	}

	// turns

	Network.prototype.updateForTurn = function(universe)
	{
		for (var i = 0; i < this.links.length; i++)
		{
			var link = this.links[i];
			link.updateForTurn(universe, this);
		}
	}

	// drawing

	Network.prototype.draw = function(universe, camera)
	{
		var display = universe.display;

		var network = this;
		var drawPos = this.drawPos;
		var drawPosFrom = this.drawPosFrom;
		var drawPosTo = this.drawPosTo;

		var nodeRadiusActual = NetworkNode.RadiusActual;

		var shipsInLinks = [];
		for (var i = 0; i < this.links.length; i++)
		{
			var link = this.links[i];
			link.draw
			(
				universe,
				camera, 
				nodeRadiusActual, 
				drawPosFrom, 
				drawPosTo
			);
			shipsInLinks = shipsInLinks.concat(link.ships);
		}

		var drawablesToSort = shipsInLinks.concat(this.nodes);
		var drawablesSortedByZ = [];
		for (var i = 0; i < drawablesToSort.length; i++)
		{
			var drawableToSort = drawablesToSort[i];
			camera.coordsTransformWorldToView
			(
				drawPos.overwriteWith(drawableToSort.loc.pos)
			);

			if (drawPos.z > 0)
			{
				var j;
				for (j = 0; j < drawablesSortedByZ.length; j++)
				{
					var drawableSorted = drawablesSortedByZ[j];
					var drawableSortedDrawPos = camera.coordsTransformWorldToView
					(
						drawableSorted.loc.pos.clone()
					);
					if (drawPos.z >= drawableSortedDrawPos.z)
					{
						break;
					}
				}

				drawablesSortedByZ.insertElementAt(drawableToSort, j);
			}
		}

		for (var i = 0; i < drawablesSortedByZ.length; i++)
		{
			var drawable = drawablesSortedByZ[i];
			drawable.draw(universe, nodeRadiusActual, camera, drawPos);
		}
	}
}
