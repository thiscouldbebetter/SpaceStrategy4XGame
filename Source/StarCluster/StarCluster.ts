
class StarCluster extends PlaceBase
{
	name: string;
	nodes: StarClusterNode[];
	links: StarClusterLink[];
	factions: Faction[];

	factionIndexCurrent: number;
	linksByName: Map<string, StarClusterLink>;
	linksByStarsystemNamesFromTo: Map<string, Map<string, StarClusterLink> >
	nodesByName: Map<string, StarClusterNode>;
	_nodesAsEntities: Entity[];
	roundsSoFar: number;

	drawPos: Coords;
	drawPosFrom: Coords;
	drawPosTo: Coords;
	drawablesSortedByZ: Entity[];

	constructor
	(
		name: string,
		nodes: StarClusterNode[],
		links: StarClusterLink[],
		factions: Faction[]
	)
	{
		super
		(
			name,
			StarCluster.name, // defnName
			null, // parentName
			null, // size
			nodes // entities
		);

		this.name = name;
		this.nodes = nodes;
		this.links = links;
		this.factions = factions;

		this.nodesByName = ArrayHelper.addLookupsByName(this.nodes);

		this.linksByName = ArrayHelper.addLookupsByName(this.links);

		this.linksByStarsystemNamesFromTo = new Map<string,Map<string,StarClusterLink>>();
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
					var linksOriginatingAtNodeFrom = new Map<string,StarClusterLink>();
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

		this.factionIndexCurrent = 0;

		this.roundsSoFar = 0;
		this._roundsAreAdvancingUntilNotification = false;

		// Helper variables.
		this.drawPos = Coords.create();
		this.drawPosFrom = Coords.create();
		this.drawPosTo = Coords.create();
	}

	static empty(): StarCluster
	{
		return new StarCluster
		(
			"dummy",
			[], // nodes
			[], // links
			[] // factions
		);
	};

	static generateRandom
	(
		universe: Universe,
		nodeDefns: StarClusterNodeDefn[],
		numberOfNodes: number
	): StarCluster
	{
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
		var starsystemNames =
			randomizer.chooseNElementsFromArray(numberOfNodes, starNames);

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
			var starsystemName = starsystemNames[i];
			var nodeStarsystem = Starsystem.generateRandom(universe, starsystemName);

			var node = new StarClusterNode
			(
				nodeStarsystem.name,
				nodeDefn,
				nodePos.clone(),
				nodeStarsystem.star,
				nodeStarsystem
			);

			nodesNotYetLinked.push(node);
		}

		var nodePositions = nodesNotYetLinked.map
		(
			x => x.locatable().loc.pos
		);
		var boundsActual = Box.create().containPoints(nodePositions);
		var boundsDesired = new Box
		(
			Coords.create(), // center
			Coords.ones().multiplyScalar(2 * radiusMax) // size
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

		var linkTypes = StarClusterLinkType.Instances();
		var linkTypeNormal = linkTypes.Normal;

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

			var link = new StarClusterLink
			(
				linkTypeNormal,
				[ nodeToLink.name, nodeLinked.name ]
			);
			links.push(link);
			nodesLinked.push(nodeToLink);
			ArrayHelper.remove(nodesNotYetLinked, nodeToLink);

			for (var i = 0; i < nodePairClosestSoFar.length; i++)
			{
				var node = nodePairClosestSoFar[i];
				var starsystem = node.starsystem;
				var starsystemSize = starsystem.size();
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

				starsystem.linkPortalAdd(universe, linkPortal);
				//starsystemPortalsByStarsystemName.set(starsystemOther.name, linkPortal);
			}
		}

		var fractionOfLinksThatAreHardNotNormal = .2;
		var linksHardCount = Math.round(links.length * fractionOfLinksThatAreHardNotNormal);
		var randomizer = universe.randomizer;
		var linksHard = randomizer.chooseNElementsFromArray(linksHardCount, links);
		var linkTypeHard = linkTypes.Hard;
		linksHard.forEach(x => x.type = linkTypeHard);

		var starClusterName = NameGenerator.generateName() + " Cluster";
		var returnValue = new StarCluster(starClusterName, nodesLinked, links, []);

		return returnValue;
	}

	factionAdd(faction: Faction): void
	{
		this.factions.push(faction);
	}

	factionByName(factionName: string): Faction
	{
		return this.factions.find(x => x.name == factionName);
	}

	factionCurrent(): Faction
	{
		return this.factions[this.factionIndexCurrent];
	}

	factionPlayer(): Faction
	{
		return this.factions[0];
	}

	factionsOtherThanCurrent(): Faction[]
	{
		return this.factionsOtherThan(this.factionCurrent());
	}

	factionsOtherThan(faction: Faction): Faction[]
	{
		return this.factions.filter
		(
			x => x.name != faction.name
		);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.factions.forEach(x => x.initialize(uwpe));
	}

	linkByName(linkName: string): StarClusterLink
	{
		return this.linksByName.get(linkName);
	}

	linkByStarsystemNamesFromTo
	(
		starsystemFromName: string, starsystemToName: string
	): StarClusterLink
	{
		return this.linksByStarsystemNamesFromTo.get(starsystemFromName).get(starsystemToName);
	}

	nodeByName(nodeName: string): StarClusterNode
	{
		return this.nodesByName.get(nodeName);
	}

	nodesAsEntities(): Entity[]
	{
		if (this._nodesAsEntities == null)
		{
			this._nodesAsEntities = this.nodes.map
			(
				x => new Entity
				(
					x.name,
					[
						// x, // Removed after Framework upgrade.
						x.locatable()
					]
				)
			);
		}

		return this._nodesAsEntities;
	}

	placeForEntityLocatable(entityLocatable: Entity): any
	{
		var returnPlace = null;

		var placeTypeColonName =
			entityLocatable.locatable().loc.placeName();
		var placeTypeAndName = placeTypeColonName.split(":");
		var placeType = placeTypeAndName[0];
		var placeName = placeTypeAndName[1];

		if (placeType == StarClusterLink.name)
		{
			returnPlace = this.linkByName(placeName);
		}
		else if (placeType == Planet.name)
		{
			var starsystemName = placeName.split(" ")[0];
			var starsystem = this.starsystemByName(starsystemName);
			returnPlace = starsystem.planetByName(placeName);
		}
		else if (placeType == Starsystem.name)
		{
			returnPlace = this.starsystemByName(placeName);
		}

		return returnPlace;
	}

	roundAdvanceUntilNotificationDisable(): void
	{
		this._roundsAreAdvancingUntilNotification = false;
	}

	roundAdvanceUntilNotificationToggle(uwpe: UniverseWorldPlaceEntities): void
	{
		this._roundsAreAdvancingUntilNotification =
			(this._roundsAreAdvancingUntilNotification == false);
	}

	roundNumberCurrent(): number
	{
		return this.roundsSoFar + 1;
	}

	private _roundsAreAdvancingUntilNotification: boolean;
	roundsAreAdvancingUntilNotification(): boolean
	{
		return this._roundsAreAdvancingUntilNotification;
	}

	scale(scaleFactor: number): StarCluster
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			var node = this.nodes[i];
			node.locatable().loc.pos.multiplyScalar(scaleFactor);
		}

		return this;
	}

	starsystemByName(starsystemName: string): Starsystem
	{
		return this.nodesByName.get(starsystemName).starsystem;
	}

	// Rounds.

	updateForRound(universe: Universe, world: WorldExtended): void
	{
		for (var i = 0; i < this.links.length; i++)
		{
			var link = this.links[i];
			link.updateForRound(universe, world);
		}

		this.factions.forEach(x => x.updateForRound(universe, world) );

		this.roundsSoFar++;
	}

	// drawing

	camera2(universe: Universe): Camera
	{
		// hack - Get a camera, without a Place.
		var venue = universe.venueCurrent();
		var venueTypeName = venue.constructor.name;
		if (venueTypeName == VenueFader.name)
		{
			var venueAsVenueFader = venue as VenueFader;
			venue = venueAsVenueFader.venueCurrent();
		}
		var venueAsVenueStarCluster = venue as VenueStarCluster;
		var camera = venueAsVenueStarCluster.cameraEntity.camera();
		return camera;
	}

	draw(universe: Universe, world: World, display: Display): void
	{
		// todo - worldKnown?
		var worldAsWorldExtended = world as WorldExtended;
		var camera = worldAsWorldExtended.camera;
		this.drawForCamera(universe, camera);
	}

	drawForCamera(universe: Universe, camera: Camera): void
	{
		var drawPos = this.drawPos;
		var drawPosFrom = this.drawPosFrom;
		var drawPosTo = this.drawPosTo;

		var nodeRadiusActual = 4; // todo

		var shipsInLinks = new Array<Ship>();
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
			shipsInLinks.push(...link.ships);
		}

		var entitiesDrawableToSort = new Array<Entity>();
		entitiesDrawableToSort.push(...shipsInLinks);
		entitiesDrawableToSort.push(...this.nodes);
		var drawablesSortedByZ = new Array<Entity>();
		for (var i = 0; i < entitiesDrawableToSort.length; i++)
		{
			var entityDrawableToSort = entitiesDrawableToSort[i];
			camera.coordsTransformWorldToView
			(
				drawPos.overwriteWith(entityDrawableToSort.locatable().loc.pos)
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

				ArrayHelper.insertElementAt(drawablesSortedByZ, entityDrawableToSort, j);
			}
		}

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, this, null, null
		);

		for (var i = 0; i < drawablesSortedByZ.length; i++)
		{
			var entity = drawablesSortedByZ[i];
			uwpe.entity = entity;

			var entityTypeName = entity.constructor.name;
			if (entityTypeName == StarClusterNode.name)
			{
				var node = entity as StarClusterNode;
				node.draw(uwpe);
			}
			else if (entityTypeName == Ship.name)
			{
				var visual = entity.drawable().visual;
				visual.draw(uwpe, universe.display);
			}
		}
	}

	// Clonable.

	clone(): StarCluster
	{
		var nodesCloned = this.nodes.map(x => x.clone()) as StarClusterNode[];
		var linksCloned = ArrayHelper.clone(this.links);
		var factionsCloned = this.factions.map(x => x.clone());
		var returnValue = new StarCluster(this.name, nodesCloned, linksCloned, factionsCloned);
		return returnValue;
	}

	// Controls.

	controlBuildTimeAndPlace
	(
		universe: Universe,
		containerMainSize: Coords,
		containerInnerSize: Coords,
		margin: number,
		controlHeight: number
	): ControlBase
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var textPlace = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin,  margin), // pos
			Coords.fromXY
			(
				containerInnerSize.x - margin * 2,
				controlHeight
			), // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) =>
				{
					// hack
					var venue = c.venueCurrent() as VenueStarCluster;
					return (venue.model == null ? "" : venue.model(c.world as WorldExtended).name);
				}
			),
			fontNameAndHeight
		);

		var textRoundColonSpace = "Round:";
		var labelRound = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlHeight), // pos
			Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
			DataBinding.fromContext(textRoundColonSpace),
			fontNameAndHeight
		);

		var textRound = ControlLabel.from4Uncentered
		(
			Coords.fromXY
			(
				margin + textRoundColonSpace.length * fontHeightInPixels * 0.45,
				margin + controlHeight
			), // pos
			Coords.fromXY
			(
				containerInnerSize.x - margin * 3,
				controlHeight
			), // size
			DataBinding.fromContextAndGet
			(
				universe,
				(c: Universe) => "" + ( (c.world as WorldExtended).starCluster.roundsSoFar + 1)
			),
			fontNameAndHeight
		);

		var childControls: ControlBase[] =
		[
			textPlace,
			labelRound,
			textRound
		];

		var buttonSize = Coords.fromXY(controlHeight, controlHeight);

		var world = universe.world as WorldExtended;

		var buttonRoundNext = ControlButton.from5
		(
			Coords.fromXY
			(
				containerInnerSize.x - margin - buttonSize.x * 2,
				margin + controlHeight
			), // pos
			buttonSize,
			">", // text,
			fontNameAndHeight,
			() => world.updateForRound(uwpe)
		);

		var buttonRoundFastForward = ControlButton.from5
		(
			Coords.fromXY
			(
				containerInnerSize.x - margin - buttonSize.x,
				margin + controlHeight
			), // pos
			Coords.fromXY(controlHeight, controlHeight), // size,
			">>", // text,
			fontNameAndHeight,
			() => world.starCluster.roundAdvanceUntilNotificationToggle(uwpe)
		);

		var roundAdvanceButtons: ControlBase[] = 
		[
			buttonRoundNext,
			buttonRoundFastForward
		];

		childControls.push(...roundAdvanceButtons);

		var size = Coords.fromXY
		(
			containerInnerSize.x,
			margin * 3 + controlHeight * 2
		);

		var returnValue = ControlContainer.from4
		(
			"containerTimeAndPlace",
			Coords.fromXY(margin, margin),
			size,
			childControls
		);

		return returnValue;
	}

}
