
class NetworkLink2 extends EntityProperty
{
	namesOfNodesLinked: string[];

	ships: Ship[];
	name: string;
	color: string;

	constructor(namesOfNodesLinked: string[])
	{
		super();
		this.namesOfNodesLinked = namesOfNodesLinked;
		this.ships = new Array<Ship>();

		this.name = this.namesOfNodesLinked.join("-");

		this.color = "rgba(128, 128, 128, .4)"; // hack
	}

	direction(cluster: Network2)
	{
		return this.displacement(cluster).normalize();
	}

	displacement(cluster: Network2)
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

	length(cluster: Network2)
	{
		return this.displacement(cluster).magnitude();
	}

	nodesLinked(cluster: Network2)
	{
		var returnValue =
		[
			cluster.nodesByName.get(this.namesOfNodesLinked[0]),
			cluster.nodesByName.get(this.namesOfNodesLinked[1]),
		];

		return returnValue;
	}

	shipAdd(shipToAdd: Ship)
	{
		this.ships.push(shipToAdd);
	}

	shipRemove(shipToRemove: Ship)
	{
		ArrayHelper.remove(this.ships, shipToRemove);
	}

	_entity: Entity;
	toEntity()
	{
		if (this._entity == null)
		{
			new Entity(this.name, [ this ] );
		}
		return this._entity;
	}

	// turns

	updateForTurn(universe: Universe, world: WorldExtended)
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
				var shipSpeed = ship.movementThroughLinkPerTurn(this);
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

	draw
	(
		universe: Universe,
		camera: Camera,
		nodeRadiusActual: number,
		drawPosFrom: Coords,
		drawPosTo: Coords
	)
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
			this.color, // hack
			null
		);
	}
}
