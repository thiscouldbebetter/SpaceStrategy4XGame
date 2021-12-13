
class TurnAndMove
{
	distanceLeftThisMove: number;
	distancePerMove: number;
	energyPerMove: number;
	energyThisTurn: number;
	initiativeThisTurn: number;
	shieldingThisTurn: number;

	_displacement: Coords;

	constructor()
	{
		this.distanceLeftThisMove = 0;
		this.distancePerMove = 0;
		this.energyPerMove = null;
		this.energyThisTurn = 0;
		this.initiativeThisTurn = 1;
		this.shieldingThisTurn = 0;

		// Helper variables.
		this._displacement = Coords.create();
	}

	clear(): void
	{
		this.distanceLeftThisMove = null;
		this.distancePerMove = 0;
		this.energyThisTurn = 0;
		this.energyPerMove = 0;
		this.shieldingThisTurn = 0;
	}

	energyForMoveDeduct(): void
	{
		this.energyThisTurn -= this.energyPerMove;
	}

	moveShipTowardTarget
	(
		universe: Universe, ship: Ship, target: Entity
	): void
	{
		if (this.distanceLeftThisMove == null)
		{
			if (this.energyThisTurn >= this.energyPerMove)
			{
				this.energyThisTurn -= this.energyPerMove;
				this.distanceLeftThisMove = this.distancePerMove;
			}
		}

		if (this.distanceLeftThisMove > 0)
		{
			var shipLoc = ship.locatable().loc;
			var shipPos = shipLoc.pos;
			var targetLoc = target.locatable().loc;
			var targetPos = targetLoc.pos;

			var displacementToTarget = this._displacement.overwriteWith
			(
				targetPos
			).subtract
			(
				shipPos
			);
			var distanceToTarget = displacementToTarget.magnitude();

			var distanceMaxPerTick = 3; // hack

			var distanceToMoveThisTick =
			(
				this.distanceLeftThisMove < distanceMaxPerTick
				? this.distanceLeftThisMove
				: distanceMaxPerTick
			);

			if (distanceToTarget < distanceToMoveThisTick)
			{
				shipPos.overwriteWith(targetPos);

				// hack
				this.distanceLeftThisMove = null;
				ship.actor().activity.doNothing();
				universe.inputHelper.isEnabled = true;
				ship.order().complete();

				var targetBodyDefn = BodyDefn.fromEntity(target);
				var targetDefnName = targetBodyDefn.name;
				if (targetDefnName == LinkPortal.name)
				{
					var portal = target as LinkPortal;
					ship.linkPortalEnter(
						(universe.world as WorldExtended).network, portal, ship
					);
				}
				else if (targetDefnName == Planet.name)
				{
					var planet = target as Planet;
					var venue = universe.venueCurrent as VenueStarsystem;
					var starsystem = venue.starsystem;
					ship.planetOrbitEnter(universe, starsystem, planet);
				}
			}
			else
			{
				var directionToTarget = displacementToTarget.divideScalar
				(
					distanceToTarget
				);

				var shipVel = shipLoc.vel;
				shipVel.overwriteWith
				(
					directionToTarget
				).multiplyScalar
				(
					distanceToMoveThisTick
				);

				shipPos.add(shipVel);

				this.distanceLeftThisMove -= distanceToMoveThisTick;
				if (this.distanceLeftThisMove <= 0)
				{
					// hack
					this.distanceLeftThisMove = null;
					ship.actor().activity.doNothing();
					universe.inputHelper.isEnabled = true;
				}
			}
		}
	}

	toStringDescription(): string
	{
		return "Energy: " + this.energyThisTurn
	}
}