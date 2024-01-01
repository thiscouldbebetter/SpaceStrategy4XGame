
class FactionIntelligence
{
	name: string;
	_planetBuildableChoose: (uwpe: UniverseWorldPlaceEntities) => void;
	_starsystemMoveChoose: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		planetBuildableChoose: (uwpe: UniverseWorldPlaceEntities) => void,
		starsystemMoveChoose: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this._planetBuildableChoose = planetBuildableChoose
		this._starsystemMoveChoose = starsystemMoveChoose;
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

	planetBuildableChoose(uwpe: UniverseWorldPlaceEntities): void
	{
		this._planetBuildableChoose(uwpe);
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
			uwpe => this.computerPlanetBuildableChoose(uwpe),
			uwpe => this.computerStarsystemMoveChoose(uwpe)
		);

		this.Human = new FactionIntelligence
		(
			"Human",

			// planetBuildableChoose
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				// Do nothing.
			},

			// starsystemMoveChoose
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				// Do nothing.
			}
		);
	}

	computerPlanetBuildableChoose(uwpe: UniverseWorldPlaceEntities): void
	{
		// For now, choose a random buildable and build it wherever available.

		var universe = uwpe.universe;
		var world = uwpe.world as WorldExtended;
		var planet = (uwpe.place as PlanetAsPlace).planet;

		var faction = planet.faction();
		var buildableDefnsAvailable =
			faction.technologyResearcher.buildablesAvailable(world);

		if (buildableDefnsAvailable.length > 0)
		{
			var randomizer = universe.randomizer;

			var buildableDefnToBuild =
				randomizer.chooseRandomElementFromArray(buildableDefnsAvailable);

			var positionsToBuildAt = planet.cellPositionsAvailableToBuildBuildableDefn
			(
				universe, buildableDefnToBuild
			);

			if (positionsToBuildAt.length > 0)
			{
				var posToBuildAt =
					randomizer.chooseRandomElementFromArray(positionsToBuildAt);

				var layout = planet.layout(universe);
				layout.buildableDefnStartBuildingAtPos
				(
					universe, buildableDefnToBuild, posToBuildAt
				);
			}
		}

	}

	computerStarsystemMoveChoose(uwpe: UniverseWorldPlaceEntities): void
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
}
