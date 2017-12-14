
function NetworkLink(namesOfNodesLinked)
{
	this.namesOfNodesLinked = namesOfNodesLinked;
	this.ships = [];
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

	NetworkLink.prototype.updateForTurn = function(network)
	{
		if (this.ships.length > 0)
		{
			var nodesLinked = this.nodesLinked(universe);

			var length = this.length(network);

			var shipsExitingLink = [];

			for (var i = 0; i < this.ships.length; i++)
			{
				var ship = this.ships[i];
				var shipLoc = ship.loc;
				var shipPos = shipLoc.pos;
				var shipVel = shipLoc.vel;
				shipPos.x += Math.abs(shipVel.x);

				if (shipPos.x >= length)
				{
					var indexOfNodeDestination = (shipVel.x > 0 ? 1 : 0);
					var indexOfNodeSource = 1 - indexOfNodeDestination;

					var nodeDestination = nodesLinked[indexOfNodeDestination];
					var nodeSource = nodesLinked[indexOfNodeSource];

					var starsystemDestination = nodeDestination.starsystem;
					var starsystemSource = nodeSource.starsystem;

					var portalToExitFrom = starsystemDestination.linkPortals[starsystemSource.name];
					var exitPos = portalToExitFrom.loc.pos;
					shipPos.overwriteWith(exitPos);

					starsystemDestination.ships.push(ship);
					shipsExitingLink.push(ship);
				}
			}

			for (var i = 0; i < shipsExitingLink.length; i++)
			{
				this.ships.splice
				(
					this.ships.indexOf(shipsExitingLink[i]),
					1
				);
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

		var display = universe.display;
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

		var drawPos = drawPosFrom;

		var ships = this.ships;
		for (var i = 0; i < ships.length; i++)
		{
			var ship = ships[i];
			this.draw_Ship(cluster, camera, ship, drawPos, nodeFromPos, nodeToPos);
		}
	}

	NetworkLink.prototype.draw_Ship = function
	(
		cluster, camera, ship, drawPos, nodeFromPos, nodeToPos
	)
	{
		var forward = this.direction(cluster);
		var linkLength = this.length(cluster);

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

}
