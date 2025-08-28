
class StarClusterLink extends EntityPropertyBase<StarClusterLink>
{
	type: StarClusterLinkType;
	namesOfNodesLinked: string[];

	name: string;
	ships: Ship[];

	constructor(type: StarClusterLinkType, namesOfNodesLinked: string[])
	{
		super();

		this.type = type;
		this.namesOfNodesLinked = namesOfNodesLinked;

		this.name = this.namesOfNodesLinked.join("-");

		this.ships = new Array<Ship>();
	}

	static fromNamesOfNodesLinked(node0Name: string, node1Name: string): StarClusterLink
	{
		var linkType = StarClusterLinkType.Instances().Normal;
		var link = new StarClusterLink
		(
			linkType,
			[node0Name, node1Name]
		);
		return link;
	}

	direction(cluster: StarCluster): Coords
	{
		return this.displacement(cluster).normalize();
	}

	displacement(cluster: StarCluster): Coords
	{
		var nodesLinked = this.nodesLinked(cluster);

		var node0Pos = Locatable.of(nodesLinked[0]).loc.pos;
		var node1Pos = Locatable.of(nodesLinked[1]).loc.pos;

		var returnValue = node1Pos.clone().subtract
		(
			node0Pos
		);

		return returnValue;
	}

	frictionDivisor(): number
	{
		return this.type.frictionDivisor;
	}

	length(cluster: StarCluster): number
	{
		return this.displacement(cluster).magnitude();
	}

	nodesLinked(cluster: StarCluster): StarClusterNode[]
	{
		var returnValue =
		[
			cluster.nodeByName(this.namesOfNodesLinked[0]),
			cluster.nodeByName(this.namesOfNodesLinked[1]),
		];

		return returnValue;
	}

	shipAdd(shipToAdd: Ship): void
	{
		this.ships.push(shipToAdd);
	}

	shipRemove(shipToRemove: Ship): void
	{
		ArrayHelper.remove(this.ships, shipToRemove);
	}

	_entity: Entity;
	toEntity(): Entity
	{
		if (this._entity == null)
		{
			new Entity(this.name, [ this ] );
		}
		return this._entity;
	}

	// turns

	updateForRound(universe: Universe, world: WorldExtended): void
	{
		if (this.ships.length > 0)
		{
			var uwpe = new UniverseWorldPlaceEntities(universe, world, null, null, null);

			var cluster = world.starCluster;

			var nodesLinked = this.nodesLinked(cluster);
			var length = this.length(cluster);
			var direction = this.displacement(cluster).normalize();

			var shipsExitingLink = new Array<Ship>();

			for (var i = 0; i < this.ships.length; i++)
			{
				var ship = this.ships[i];
				var shipLoc = Locatable.of(ship).loc;
				var shipPos = shipLoc.pos;
				var shipVel = shipLoc.vel;
				var shipAsDeviceUser = ship.deviceUser();
				var shipSpeedBeforeFriction =
					shipAsDeviceUser.speedThroughLink(ship);
				var frictionDivisor = this.type.frictionDivisor;
				var shipSpeed = shipSpeedBeforeFriction / frictionDivisor;
				shipVel = shipVel.clone().multiplyScalar(shipSpeed);
				shipPos.add(shipVel);

				var isShipMovingForward = (shipVel.dotProduct(direction) > 0);
				var nodeIndexFrom = (isShipMovingForward ? 0 : 1);
				var nodeFrom = nodesLinked[nodeIndexFrom];
				var nodeFromPos = Locatable.of(nodeFrom).loc.pos;
				var distanceAlongLink = shipPos.clone().subtract
				(
					nodeFromPos
				).magnitude();

				if (distanceAlongLink >= length)
				{
					shipsExitingLink.push(ship);
				}
			}

			for (var i = 0; i < shipsExitingLink.length; i++)
			{
				var ship = shipsExitingLink[i];
				ship.linkExit(this, uwpe);
			}
		}
	}

	// drawable

	color(): Color
	{
		return this.type.color;
	}

	draw
	(
		universe: Universe,
		camera: Camera,
		nodeRadiusActual: number,
		drawPosFrom: Coords,
		drawPosTo: Coords
	): void
	{
		var cluster = (universe.world as WorldExtended).starCluster;
		var nodesLinked = this.nodesLinked(cluster);
		var nodeFromPos = Locatable.of(nodesLinked[0]).loc.pos;
		var nodeToPos = Locatable.of(nodesLinked[1]).loc.pos;

		camera.coordsTransformWorldToView
		(
			drawPosFrom.overwriteWith(nodeFromPos)
		);

		camera.coordsTransformWorldToView
		(
			drawPosTo.overwriteWith(nodeToPos)
		);

		if (drawPosFrom.z <= 0 || drawPosTo.z <= 0)
		{
			return; // hack - todo - Clipping.
		}

		var directionFromNode0To1InView = drawPosTo.clone().subtract
		(
			drawPosFrom
		).normalize();

		var perpendicular = directionFromNode0To1InView.clone().right().half();

		var perspectiveFactorFrom =
			camera.focalLength / drawPosFrom.z;
		var perspectiveFactorTo =
			camera.focalLength / drawPosTo.z;

		var radiusApparentFrom =
			nodeRadiusActual * perspectiveFactorFrom;
		var radiusApparentTo =
			nodeRadiusActual * perspectiveFactorTo;

		var display = universe.display;

		display.drawPolygon
		(
			[
				perpendicular.clone().multiplyScalar(0 - radiusApparentFrom).add(drawPosFrom),
				perpendicular.clone().multiplyScalar(0 - radiusApparentTo).add(drawPosTo),
				perpendicular.clone().multiplyScalar(radiusApparentTo).add(drawPosTo),
				perpendicular.clone().multiplyScalar(radiusApparentFrom).add(drawPosFrom)
			],
			this.color(), // hack
			null
		);
	}

	// Clonable.

	clone(): StarClusterLink
	{
		return new StarClusterLink(this.type, this.namesOfNodesLinked.slice());
	}

	overwriteWith(other: StarClusterLink): StarClusterLink
	{
		return this;
	}

}

class StarClusterLinkType
{
	name: string;
	frictionDivisor: number;
	color: Color;

	constructor(name: string, frictionDivisor: number, color: Color)
	{
		this.name = name;
		this.frictionDivisor = frictionDivisor;
		this.color = color;
	}

	static _instances: StarClusterLinkType_Instances;
	static Instances(): StarClusterLinkType_Instances
	{
		if (StarClusterLinkType._instances == null)
		{
			StarClusterLinkType._instances = new StarClusterLinkType_Instances();
		}
		return StarClusterLinkType._instances;
	}

	static byName(name: string): StarClusterLinkType
	{
		return StarClusterLinkType.Instances().byName(name);
	}
}

class StarClusterLinkType_Instances
{
	Normal: StarClusterLinkType;
	Hard: StarClusterLinkType;

	_All: StarClusterLinkType[];

	constructor()
	{
		var colors = Color.Instances();

		this.Normal 	= new StarClusterLinkType("Normal", 1, colors.Gray.clone().alphaSet(.4) );
		this.Hard 		= new StarClusterLinkType("Hard", 5, colors.Red.clone().alphaSet(.4) );

		this._All = [ this.Normal, this.Hard ];
	}

	byName(name: string): StarClusterLinkType
	{
		return this._All.find(x => x.name == name);
	}
}
