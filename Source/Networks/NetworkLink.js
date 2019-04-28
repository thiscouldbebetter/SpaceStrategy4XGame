
function NetworkLink(namesOfNodesLinked)
{
	this.namesOfNodesLinked = namesOfNodesLinked;
	this.ships = [];

	this.name = this.namesOfNodesLinked.join("-");

	this.color = "rgba(128, 128, 128, .25)"; // hack
}

{
	NetworkLink.prototype.direction = function(cluster)
	{
		return this.displacement(cluster).normalize();
	}

	NetworkLink.prototype.displacement = function(cluster)
	{
		var nodesLinked = this.nodesLinked(cluster);

		var returnValue = nodesLinked[1].loc.pos.clone().subtract
		(
			nodesLinked[0].loc.pos
		);

		return returnValue;
	}

	NetworkLink.prototype.length = function(cluster)
	{
		return this.displacement(cluster).magnitude();
	}

	NetworkLink.prototype.nodesLinked = function(cluster)
	{
		var returnValue =
		[
			cluster.nodes[this.namesOfNodesLinked[0]],
			cluster.nodes[this.namesOfNodesLinked[1]],
		];

		return returnValue;
	}

	// turns

	NetworkLink.prototype.updateForTurn = function(universe, world)
	{
		if (this.ships.length > 0)
		{
			var cluster = world.network;

			var nodesLinked = this.nodesLinked(cluster);
			var length = this.length(cluster);
			var direction = this.displacement(cluster).normalize();

			var shipsExitingLink = [];

			for (var i = 0; i < this.ships.length; i++)
			{
				var ship = this.ships[i];
				var shipLoc = ship.loc;
				var shipPos = shipLoc.pos;
				var shipVel = shipLoc.vel;
				var shipSpeed = ship.movementThroughLinkPerTurn(this);
				shipPos.add
				(
					shipVel.clone().multiplyScalar(shipSpeed)
				);

				var isShipMovingForward = (shipVel.dotProduct(direction) > 0)
				var nodeIndexFrom = (isShipMovingForward ? 0 : 1);
				var nodeFrom = nodesLinked[nodeIndexFrom];
				var distanceAlongLink = shipPos.clone().subtract
				(
					nodeFrom.loc.pos
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

	NetworkLink.prototype.draw = function
	(
		universe,
		camera,
		nodeRadiusActual,
		drawPosFrom,
		drawPosTo
	)
	{
		var cluster = universe.world.network;
		var nodesLinked = this.nodesLinked(cluster);
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
			this.color // hack
		);
	}
}
