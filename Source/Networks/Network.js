
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

		var nodesLinked = [ nodesNotYetLinked[0] ];
		nodesNotYetLinked.splice(0, 1);
		var links = [];
		var colors = Color.Instances();
		
		var bodyDefnLinkPortal = new BodyDefn
		(
			"LinkPortal", 
			new Coords(10, 10), // size
			new VisualGroup
			([
				new VisualCircle(10, colors.Gray.systemColor, colors.Gray.systemColor)
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
			nodesNotYetLinked.splice(nodesNotYetLinked.indexOf(nodeToLink), 1);

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

	Network.prototype.drawToDisplayForCamera = function(universe, display, camera)
	{
		var network = this;
		var drawPos = display.drawPos;
		var drawPosFrom = new Coords(0, 0, 0);
		var drawPosTo = new Coords(0, 0, 0);

		var cameraPos = camera.loc.pos;

		var networkNodes = network.nodes;
		var numberOfNetworkNodes = networkNodes.length;

		var networkLinks = network.links;
		var numberOfNetworkLinks = networkLinks.length;

		var graphics = display.graphics;
		graphics.fillStyle = "rgba(128, 128, 128, .1)";

		var nodeRadiusActual = NetworkNode.RadiusActual;

		for (var i = 0; i < numberOfNetworkLinks; i++)
		{
			var link = networkLinks[i];
			this.drawToDisplayForCamera_Link
			(
				universe,
				display, camera, link, 
				nodeRadiusActual, drawPos, 
				drawPosFrom, drawPosTo
			);
		}

		for (var i = 0; i < numberOfNetworkNodes; i++)
		{
			var node = networkNodes[i];
			this.drawToDisplayForCamera_Node
			(
				display, node, nodeRadiusActual, camera, drawPos
			);
		}
	}

	Network.prototype.drawToDisplayForCamera_Link = function
	(
		universe,
		display, 
		camera, 
		link,
		nodeRadiusActual, 
		drawPos, 
		drawPosFrom, 
		drawPosTo
	)
	{
		var network = this;
		var nodesLinked = link.nodesLinked(universe);
		var nodeFromPos = nodesLinked[0].loc.pos;
		var nodeToPos = nodesLinked[1].loc.pos;

		camera.coordsTransformWorldToView
		(
			drawPosFrom.overwriteWith(nodeFromPos)
		);

		camera.coordsTransformWorldToView
		(
			drawPosTo.overwriteWith(nodeToPos)
		);

		var directionFromNode0To1InView = drawPosTo.clone().subtract
		(
			drawPosFrom
		).normalize();

		var perpendicular = directionFromNode0To1InView.clone().right();

		var perspectiveFactorFrom = 
			camera.focalLength / drawPosFrom.z;
		var perspectiveFactorTo = 
			camera.focalLength / drawPosTo.z;

		var radiusApparentFrom = 
			nodeRadiusActual * perspectiveFactorFrom;
		var radiusApparentTo = 
			nodeRadiusActual * perspectiveFactorTo;

		var graphics = display.graphics;
		graphics.beginPath();
		graphics.moveTo(drawPosFrom.x, drawPosFrom.y);
		graphics.lineTo(drawPosTo.x, drawPosTo.y);
		graphics.lineTo
		(
			drawPosTo.x + perpendicular.x * radiusApparentTo,
			drawPosTo.y + perpendicular.y * radiusApparentTo
		);
		graphics.lineTo
		(
			drawPosFrom.x + perpendicular.x * radiusApparentFrom, 
			drawPosFrom.y + perpendicular.y * radiusApparentFrom
		);
		graphics.fill();

		for (var i = 0; i < link.ships.length; i++)
		{
			var ship = link.ships[i];
			this.drawToDisplayForCamera_Link_Ship
			(
				universe, display, camera, link, ship, drawPos, nodeFromPos, nodeToPos
			);
		}
	}

	Network.prototype.drawToDisplayForCamera_Link_Ship = function
	(
		universe, display, camera, link, ship, drawPos, nodeFromPos, nodeToPos
	)
	{
		var forward = link.direction();
		var linkLength = link.length();

		var fractionOfLinkTraversed = ship.loc.pos.x / linkLength; 

		var shipVel = ship.loc.vel;
		if (shipVel.x < 0)
		{
			fractionOfLinkTraversed = 1 - fractionOfLinkTraversed;
			forward.multiplyScalar(-1);
		}

		drawPos.overwriteWith
		(
			nodeFromPos
		).multiplyScalar
		(
			1 - fractionOfLinkTraversed
		).add
		(
			nodeToPos.clone().multiplyScalar
			(
				fractionOfLinkTraversed
			)
		);

		// todo
		display.graphics.strokeRect(drawPos.x, drawPos.y, 10, 10);
	}

	Network.prototype.drawToDisplayForCamera_Node = function
	(
		display, node, nodeRadiusActual, camera, drawPos
	)
	{
		var nodePos = node.loc.pos;

		drawPos.overwriteWith(nodePos);
		camera.coordsTransformWorldToView(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = nodeRadiusActual * perspectiveFactor;

		var alpha = Math.pow(perspectiveFactor, 4); // hack

		//var nodeColor = node.defn.color.systemColor;
		var nodeColor = "rgba(128, 128, 128, " + alpha + ")"

		display.drawCircle(drawPos, radiusApparent, nodeColor, nodeColor);
		drawPos.x += radiusApparent;
		display.drawText(node.starsystem.name, 10, drawPos, "White", nodeColor);
	}
}
