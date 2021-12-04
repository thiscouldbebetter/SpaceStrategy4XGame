
class Network2 //
{
	name: string;
	nodes: NetworkNode2[];
	links: NetworkLink2[];

	linksByStarsystemNamesFromTo: Map<string,Map<string,NetworkLink2> >
	nodesByName: Map<string,NetworkNode2>;
	_nodesAsEntities: Entity[];

	drawPos: Coords;
	drawPosFrom: Coords;
	drawPosTo: Coords;
	drawablesSortedByZ: Entity[];

	constructor
	(
		name: string,
		nodes: NetworkNode2[],
		links: NetworkLink2[]
	)
	{
		this.name = name;
		this.nodes = nodes;
		this.links = links;

		this.nodesByName = ArrayHelper.addLookupsByName(this.nodes);

		this.linksByStarsystemNamesFromTo = new Map<string,Map<string,NetworkLink2>>();
		for (var i = 0; i < this.links.length; i++)
		{
			var link = this.links[i];
			var namesOfNodesLinked = link.namesOfNodesLinked;

			for (var n = 0; n < namesOfNodesLinked.length; n++)
			{
				var nameOfNodeFrom = namesOfNodesLinked[n];
				var nameOfNodeTo = namesOfNodesLinked[1 - n];

				if (this.linksByStarsystemNamesFromTo.has(nameOfNodeFrom) == false)
				{
					var linksOriginatingAtNodeFrom = new Map<string,NetworkLink2>();
					this.linksByStarsystemNamesFromTo.set
					(
						nameOfNodeFrom, linksOriginatingAtNodeFrom
					);
				}

				var linksOriginatingAtNodeFrom =
					this.linksByStarsystemNamesFromTo.get(nameOfNodeFrom);

				linksOriginatingAtNodeFrom.set(nameOfNodeTo, link);
			}
		}

		// Helper variables.
		this.drawPos = Coords.create();
		this.drawPosFrom = Coords.create();
		this.drawPosTo = Coords.create();
	}

	static generateRandom
	(
		universe: Universe,
		name: string,
		nodeDefns: NetworkNodeDefn[],
		numberOfNodes: number
	): Network2
	{
		var nodesNotYetLinked = [];

		var radiusMin = .25;
		var radiusMax = 1;
		var radiusRange = radiusMax - radiusMin;
		var distanceBetweenNodesMin = .05;

		var nodePos = Coords.create();
		var displacementOfNodeNewFromOther = Coords.create();
		var minusOnes = new Coords(-1, -1, -1);

		for (var i = 0; i < numberOfNodes; i++)
		{
			var distanceOfNodeNewFromExisting = 0;

			while (distanceOfNodeNewFromExisting < distanceBetweenNodesMin)
			{
				nodePos.randomize(universe.randomizer).double().add
				(
					minusOnes
				).normalize().multiplyScalar
				(
					radiusMin + radiusRange * Math.random()
				);

				distanceOfNodeNewFromExisting = distanceBetweenNodesMin;

				for (var j = 0; j < i; j++)
				{
					var nodeOther = nodesNotYetLinked[j];
					var nodeOtherPos = nodeOther.locatable().loc.pos;

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

			var node = new NetworkNode2
			(
				nodeStarsystem.name,
				nodeDefn,
				nodePos.clone(),
				nodeStarsystem
			);

			nodesNotYetLinked.push(node);
		}

		var nodePositions = nodesNotYetLinked.map
		(
			x => x.locatable().loc.pos
		);
		var boundsActual = new Box(Coords.create(), Coords.create()).ofPoints(nodePositions);
		var boundsDesired = new Box
		(
			Coords.create(), // center
			new Coords(1, 1, 1).multiplyScalar(2 * radiusMax) // size
		);

		var boundsActualSizeHalf = boundsActual.sizeHalf();
		var boundsDesiredSizeHalf = boundsDesired.sizeHalf();
		for (var i = 0; i  < nodePositions.length; i++)
		{
			var nodePos = nodePositions[i];
			nodePos.subtract(boundsActual.center);
			nodePos.divide(boundsActualSizeHalf).multiply(boundsDesiredSizeHalf);
		}

		var nodesLinked = [ nodesNotYetLinked[0] ];
		ArrayHelper.removeAt(nodesNotYetLinked, 0);
		var links = [];

		var bodyDefnLinkPortal = LinkPortal.bodyDefn();

		var tempPos = Coords.create();

		while (nodesLinked.length < numberOfNodes)
		{
			var nodePairClosestSoFar = null;
			var distanceBetweenNodePairClosestSoFar = 4; // hack

			for (var i = 0; i < nodesLinked.length; i++)
			{
				var nodeLinked = nodesLinked[i];
				var nodeLinkedPos = nodeLinked.locatable().loc.pos;

				for (var j = 0; j < nodesNotYetLinked.length; j++)
				{
					var nodeToLink = nodesNotYetLinked[j];

					var distanceBetweenNodes = tempPos.overwriteWith
					(
						nodeLinkedPos
					).subtract
					(
						nodeToLink.locatable().loc.pos
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

			var link = new NetworkLink2
			([
				nodeToLink.name,
				nodeLinked.name
			]);
			links.push(link);
			nodesLinked.push(nodeToLink);
			ArrayHelper.remove(nodesNotYetLinked, nodeToLink);

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
					Coords.create().randomize(universe.randomizer).multiply
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

				starsystem.linkPortalAdd(linkPortal);
				//starsystemPortalsByStarsystemName.set(starsystemOther.name, linkPortal);
			}
		}

		var returnValue = new Network2(name, nodesLinked, links);

		return returnValue;
	}

	linkByStarsystemNamesFromTo
	(
		starsystemFromName: string, starsystemToName: string
	): NetworkLink2
	{
		return this.linksByStarsystemNamesFromTo.get(starsystemFromName).get(starsystemToName);
	}

	nodeByName(nodeName: string): NetworkNode2
	{
		return this.nodesByName.get(nodeName);
	}

	nodesAsEntities(): Entity[]
	{
		if (this._nodesAsEntities == null)
		{
			this._nodesAsEntities = this.nodes.map
			(
				x => new Entity(x.name, [x, x.locatable()] )
			);
		}

		return this._nodesAsEntities;
	}

	scale(scaleFactor: number): Network2
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			var node = this.nodes[i];
			node.locatable().loc.pos.multiplyScalar(scaleFactor);
		}

		return this;
	}

	// turns

	updateForTurn(universe: Universe, world: WorldExtended): void
	{
		for (var i = 0; i < this.links.length; i++)
		{
			var link = this.links[i];
			link.updateForTurn(universe, world);
		}
	}

	// drawing

	draw(universe: Universe, camera: Camera): void
	{
		var drawPos = this.drawPos;
		var drawPosFrom = this.drawPosFrom;
		var drawPosTo = this.drawPosTo;

		var nodeRadiusActual = NetworkNode2.RadiusActual();

		var shipsInLinks = new Array<any>();
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
		var drawablesSortedByZ = new Array<Entity>();
		for (var i = 0; i < drawablesToSort.length; i++)
		{
			var drawableToSort = drawablesToSort[i];
			camera.coordsTransformWorldToView
			(
				drawPos.overwriteWith(drawableToSort.locatable().loc.pos)
			);

			if (drawPos.z > 0)
			{
				var j;
				for (j = 0; j < drawablesSortedByZ.length; j++)
				{
					var drawableSorted = drawablesSortedByZ[j];
					var drawableSortedPos = drawableSorted.locatable().loc.pos.clone();
					var drawableSortedDrawPos = camera.coordsTransformWorldToView
					(
						drawableSortedPos
					);
					if (drawPos.z >= drawableSortedDrawPos.z)
					{
						break;
					}
				}

				ArrayHelper.insertElementAt(drawablesSortedByZ, drawableToSort, j);
			}
		}

		for (var i = 0; i < drawablesSortedByZ.length; i++)
		{
			var entity = drawablesSortedByZ[i];
			var node = entity as NetworkNode2;
			if (node != null)
			{
				node.draw(universe, nodeRadiusActual, camera);
			}
			else
			{
				var ship = entity as Ship;
				if (ship != null)
				{
					ship.draw(universe, nodeRadiusActual, camera, this.drawPos);
				}
			}
		}
	}

	// Clonable.

	clone(): Network2
	{
		var nodesCloned = this.nodes.map(x => x.clone()) as NetworkNode2[];
		var linksCloned = ArrayHelper.clone(this.links);
		var returnValue = new Network2(this.name, nodesCloned, linksCloned);
		return returnValue;
	}
}
