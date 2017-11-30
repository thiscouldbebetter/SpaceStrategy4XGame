
function NetworkLink(namesOfNodesLinked)
{
	this.namesOfNodesLinked = namesOfNodesLinked;
	this.ships = [];
}

{
	NetworkLink.prototype.direction = function()
	{
		return this.displacement().normalize();
	}

	NetworkLink.prototype.displacement = function()
	{
		var nodesLinked = this.nodesLinked(universe);

		var returnValue = nodesLinked[1].loc.pos.clone().subtract
		(
			nodesLinked[0].loc.pos
		);

		return returnValue;
	}

	NetworkLink.prototype.length = function()
	{
		return this.displacement().magnitude();
	}

	NetworkLink.prototype.nodesLinked = function(universe)
	{
		var network = universe.world.network;

		var returnValue = 
		[
			network.nodes[this.namesOfNodesLinked[0]],
			network.nodes[this.namesOfNodesLinked[1]],
		];

		return returnValue;
	}

	// turns

	NetworkLink.prototype.updateForTurn = function(network)
	{
		if (this.ships.length > 0)
		{
			var nodesLinked = this.nodesLinked(universe);

			var length = this.length();

			var shipsExitingLink = [];

			for (var i = 0; i < this.ships.length; i++)
			{
				var ship = this.ships[i];
				var shipPos = ship.loc.pos;
				shipPos.x += Math.abs(ship.vel.x);
				if (shipPos.x >= length)
				{
					var indexOfNodeDestination = (ship.vel.x > 0 ? 1 : 0);
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
}
