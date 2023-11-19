
class TurnTaker implements EntityProperty<TurnTaker>
{
	distanceLeftThisMove: number;
	distancePerMove: number;
	energyPerMove: number;
	energyThisTurn: number;
	initiativeThisTurn: number;
	shieldingThisTurn: number;

	private _displacement: Coords;

	constructor()
	{
		this.distanceLeftThisMove = null;
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
		uwpe: UniverseWorldPlaceEntities, ship: Ship, target: Entity
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
			this.moveShipTowardTarget2(uwpe, ship, target);
		}
	}

	moveShipTowardTarget2
	(
		uwpe: UniverseWorldPlaceEntities,
		ship: Ship,
		target: Entity
	): void
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

		this.moveShipTowardTarget3
		(
			uwpe,
			displacementToTarget,
			distanceToTarget,
			distanceToMoveThisTick,
			ship,
			target
		);
	}

	moveShipTowardTarget3
	(
		uwpe: UniverseWorldPlaceEntities,
		displacementToTarget: Coords,
		distanceToTarget: number,
		distanceToMoveThisTick: number,
		ship: Ship,
		target: Entity
	)
	{
		var universe = uwpe.universe;
		var shipLoc = ship.locatable().loc;
		var shipPos = shipLoc.pos;

		if (distanceToTarget <= distanceToMoveThisTick)
		{
			var targetPos = target.locatable().loc.pos;
			shipPos.overwriteWith(targetPos);

			// hack
			this.distanceLeftThisMove = null;
			ship.actor().activity.doNothing();
			universe.inputHelper.isEnabled = true;

			var shipOrder = ship.order();
			if (shipOrder != null) // hack
			{
				shipOrder.complete();
			}

			ship.collideWithEntity(uwpe, target);
		}
		else
		{
			var directionToTarget = displacementToTarget.divideScalar
			(
				distanceToTarget
			);

			var shipAccel = shipLoc.accel;
			shipAccel.overwriteWith
			(
				directionToTarget
			).multiplyScalar
			(
				distanceToMoveThisTick
			);

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



	toStringDescription(): string
	{
		return "Energy: " + this.energyThisTurn
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.

	equals(other: TurnTaker): boolean { return false; }
}