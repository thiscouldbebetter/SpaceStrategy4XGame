
class NetworkLink2 implements EntityPropertyBase
{
	type: NetworkLink2Type;
	namesOfNodesLinked: string[];

	name: string;
	ships: Ship[];

	constructor(type: NetworkLink2Type, namesOfNodesLinked: string[])
	{
		this.type = type;
		this.namesOfNodesLinked = namesOfNodesLinked;

		this.name = this.namesOfNodesLinked.join("-");

		this.ships = new Array<Ship>();
	}

	direction(cluster: Network2): Coords
	{
		return this.displacement(cluster).normalize();
	}

	displacement(cluster: Network2): Coords
	{
		var nodesLinked = this.nodesLinked(cluster);

		var node0Pos = nodesLinked[0].locatable().loc.pos;
		var node1Pos = nodesLinked[1].locatable().loc.pos;

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

	length(cluster: Network2): number
	{
		return this.displacement(cluster).magnitude();
	}

	nodesLinked(cluster: Network2): NetworkNode2[]
	{
		var returnValue =
		[
			cluster.nodesByName.get(this.namesOfNodesLinked[0]),
			cluster.nodesByName.get(this.namesOfNodesLinked[1]),
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
			var cluster = world.network;

			var nodesLinked = this.nodesLinked(cluster);
			var length = this.length(cluster);
			var direction = this.displacement(cluster).normalize();

			var shipsExitingLink = new Array<Ship>();

			for (var i = 0; i < this.ships.length; i++)
			{
				var ship = this.ships[i];
				var shipLoc = ship.locatable().loc;
				var shipPos = shipLoc.pos;
				var shipVel = shipLoc.vel;
				var shipSpeed = ship.movementSpeedThroughLinkThisRound(this);
				shipPos.add
				(
					shipVel.clone().multiplyScalar(shipSpeed)
				);

				var isShipMovingForward = (shipVel.dotProduct(direction) > 0);
				var nodeIndexFrom = (isShipMovingForward ? 0 : 1);
				var nodeFrom = nodesLinked[nodeIndexFrom];
				var distanceAlongLink = shipPos.clone().subtract
				(
					nodeFrom.locatable().loc.pos
				).magnitude();

				if (distanceAlongLink >= length)
				{
					shipsExitingLink.push(ship);
				}
			}

			for (var i = 0; i < shipsExitingLink.length; i++)
			{
				var ship = shipsExitingLink[i];
				ship.linkExit(world, this);
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
		var cluster = (universe.world as WorldExtended).network;
		var nodesLinked = this.nodesLinked(cluster);
		var nodeFromPos = nodesLinked[0].locatable().loc.pos;
		var nodeToPos = nodesLinked[1].locatable().loc.pos;

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

	clone(): NetworkLink2
	{
		return new NetworkLink2(this.type, this.namesOfNodesLinked.slice());
	}

	overwriteWith(other: NetworkLink2): NetworkLink2
	{
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable
	equals(other: EntityPropertyBase): boolean { return false; }
}

class NetworkLink2Type
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

	static _instances: NetworkLink2Type_Instances;
	static Instances(): NetworkLink2Type_Instances
	{
		if (NetworkLink2Type._instances == null)
		{
			NetworkLink2Type._instances = new NetworkLink2Type_Instances();
		}
		return NetworkLink2Type._instances;
	}

	static byName(name: string): NetworkLink2Type
	{
		return NetworkLink2Type.Instances().byName(name);
	}
}

class NetworkLink2Type_Instances
{
	Normal: NetworkLink2Type;
	Hard: NetworkLink2Type;

	_All: NetworkLink2Type[];

	constructor()
	{
		var colors = Color.Instances();

		this.Normal 	= new NetworkLink2Type("Normal", 1, colors.Gray.clone().alphaSet(.4) );
		this.Hard 		= new NetworkLink2Type("Hard", 5, colors.Red.clone().alphaSet(.4) );

		this._All = [ this.Normal, this.Hard ];
	}

	byName(name: string): NetworkLink2Type
	{
		return this._All.find(x => x.name == name);
	}
}
