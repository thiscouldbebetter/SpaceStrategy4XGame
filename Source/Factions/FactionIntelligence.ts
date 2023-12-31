
class FactionIntelligence
{
	name: string;
	_starsystemMoveChoose: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		moveChoose: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this._starsystemMoveChoose = moveChoose;
	}

	static _instances: FactionIntelligence_Instances;
	static Instances(): FactionIntelligence_Instances
	{
		if (FactionIntelligence._instances == null)
		{
			FactionIntelligence._instances = new FactionIntelligence_Instances();
		}
		return FactionIntelligence._instances;
	}

	starsystemMoveChoose(uwpe: UniverseWorldPlaceEntities): void
	{
		this._starsystemMoveChoose(uwpe);
	}
}

class FactionIntelligence_Instances
{
	Computer: FactionIntelligence;
	Human: FactionIntelligence;

	constructor()
	{
		this.Computer = new FactionIntelligence
		(
			"Computer",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				// For now, choose a random ship and move it toward a random position.

				var universe = uwpe.universe;
				var venueStarsystem = universe.venueCurrent() as VenueStarsystem;
				var starsystem = venueStarsystem.starsystem;
				var world = universe.world as WorldExtended;
				var factionToMove = starsystem.factionToMove(world);
				var shipsAll = starsystem.ships;
				var factionToMoveShips =
					shipsAll.filter(x => x.factionable().faction() == factionToMove);
				var factionToMoveShipsWithEnergyToMove = factionToMoveShips.filter
				(
					x => x.deviceUser().energyRemainingThisRoundIsEnoughToMove(uwpe.entitySet(x) )
				);
				if (factionToMoveShipsWithEnergyToMove.length == 0)
				{
					starsystem.factionToMoveAdvance(world);
				}
				else
				{
					var shipToMove = factionToMoveShipsWithEnergyToMove[0];
					var shipToMoveOrder = shipToMove.orderable().order(shipToMove);
					var orderDefns = OrderDefn.Instances();
					shipToMoveOrder.defnSet(orderDefns.Go);
					var posToTarget = Coords.random(universe.randomizer).multiply(starsystem.size());
					var entityToTarget = Entity.fromProperty(Locatable.fromPos(posToTarget));
					shipToMoveOrder.entityBeingTargetedSet(entityToTarget);
					shipToMoveOrder.obey(uwpe);
				}

			}
		);

		this.Human = new FactionIntelligence
		(
			"Human",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				// Do nothing.
			}
		);
	}
}
