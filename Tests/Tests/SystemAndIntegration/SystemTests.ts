
class SystemTests extends TestFixture
{
	constructor()
	{
		super(SystemTests.name);
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.playFromStart
		];

		return returnTests;
	}

	// Tests.

	playFromStart(): void
	{
		var universe = new EnvironmentMock().universeBuild();
		var world = universe.world as WorldExtended;
		var factionUser = world.factions[0];
		var starsystemUser = factionUser.starsystemHome(world);
		var planetUser = factionUser.planetHome(world);
		var positionsAvailableToBuildAt =
			planetUser.cellPositionsAvailableToBuildOnSurface();
		var posToBuildAt = positionsAvailableToBuildAt[0];
		var buildableLaboratory =
			Buildable.fromDefnNameAndPos("Laboratory", posToBuildAt);

		var buildableLabAsEntity = buildableLaboratory.toEntity(world);
		planetUser.buildableEntityBuild(buildableLabAsEntity);

		while (buildableLaboratory.isComplete == false)
		{
			world.updateForTurn_IgnoringNotifications(universe);
		}

		Assert.isTrue(buildableLaboratory.isComplete);

		var researcher = factionUser.technologyResearcher;

		var technologiesNeededToBuildShipNames =
		[
			"Drives, Basic",
			"Generators, Basic",
			"Biology, Basic",
			"Shields, Basic",
			"Space Structures, Basic",
			"Weapons, Basic"
		];

		for (var t = 0; t < technologiesNeededToBuildShipNames.length; t++)
		{
			var technologyToResearchName =
				technologiesNeededToBuildShipNames[t];

			var technologiesAvailableToResearch =
				researcher.technologiesAvailableForResearch(world);

			var technologyToResearch =
				technologiesAvailableToResearch.find
				(
					x => x.name == technologyToResearchName
				);

			researcher.technologyResearch(technologyToResearch);

			var hasTechnologyBeenDiscoveredYet = false;
			while (hasTechnologyBeenDiscoveredYet == false)
			{
				world.updateForTurn_IgnoringNotifications(universe);

				hasTechnologyBeenDiscoveredYet =
					researcher.technologyIsKnown(technologyToResearch);
			}
		}

		positionsAvailableToBuildAt =
			planetUser.cellPositionsAvailableToOccupyInOrbit();
		posToBuildAt = positionsAvailableToBuildAt[0];

		var buildableShipyard = Buildable.fromDefnNameAndPos
		(
			"Shipyard", posToBuildAt
		);
		var shipyardEntity = buildableShipyard.toEntity(world);
		planetUser.buildableEntityBuild(shipyardEntity);

		while (buildableShipyard.isComplete == false)
		{
			world.updateForTurn_IgnoringNotifications(universe);
		}

		positionsAvailableToBuildAt =
			planetUser.cellPositionsAvailableToOccupyInOrbit();
		posToBuildAt = positionsAvailableToBuildAt[0];

		var shipComponentNames =
		[
			"Ship Hull, Small",
			"Ship Drive, Basic",
			"Ship Generator, Basic",
			"Colony Hub",
			"Colony Hub"
		];

		for (var i = 0; i < shipComponentNames.length; i++)
		{
			var shipComponentName = shipComponentNames[i];

			var buildableShipComponent =
				Buildable.fromDefnName(shipComponentName);
			var buildableShipComponentAsEntity = buildableShipComponent.toEntity(world);
			planetUser.buildableEntityBuild(buildableShipComponentAsEntity);

			Assert.isFalse(buildableShipComponent.isComplete);

			while (buildableShipComponent.isComplete == false)
			{
				world.updateForTurn_IgnoringNotifications(universe);
			}

			Assert.isTrue(buildableShipComponent.isComplete);
		}

		var shipyard = new ShipBuilder();
		var ship = shipyard.build
		(
			universe, world, factionUser,
			planetUser, shipyardEntity, shipComponentNames
		);

		Assert.isNotNull(ship);

		ship.planetOrbitExit(universe, starsystemUser, planetUser);

		var linkPortalToGoTo = starsystemUser.linkPortals[0];

		Assert.isNotNull(linkPortalToGoTo);

		var starsystemBeyondLinkName =
			linkPortalToGoTo.name.split(" to ")[1];

		var network = world.network;
		var starsystemBeyondLink = network.starsystemByName(starsystemBeyondLinkName);

		var factionUserKnowledge = factionUser.knowledge;
		var starsystemsKnown = factionUserKnowledge.starsystems(world);
		Assert.isTrue(starsystemsKnown.length == 1);

		var orderDefns = OrderDefn.Instances();

		var shipOrder = new Order().defnSet
		(
			orderDefns.Go
		).entityBeingTargetedSet
		(
			linkPortalToGoTo
		);

		ship.orderSet(shipOrder);

		universe.venueNextSet(starsystemUser.toVenue() ); // Can this be avoided?

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, ship, null
		);

		while (shipOrder.isComplete == false)
		{
			var shipTurnAndMove = ship.turnAndMove;

			var shipEnergyBeforeMove = shipTurnAndMove.energyThisTurn;

			if (shipEnergyBeforeMove < shipTurnAndMove.energyPerMove)
			{
				world.updateForRound_IgnoringNotifications(uwpe);
			}
			else
			{
				while
				(
					shipOrder.isComplete == false
					&& shipTurnAndMove.energyThisTurn == shipEnergyBeforeMove
				)
				{
					shipOrder.obey(uwpe);
					universe.updateForTimerTick();
				}
			}
		}

		// There's something weird going on with these two lines.
		shipOrder.clear();
		shipOrder.isComplete = false; // hack - This shouldn't be necessary, but is.

		universe.venueCurrent = null;

		var shipLoc = ship.locatable().loc;

		while (shipLoc.placeName.startsWith(NetworkLink2.name))
		{
			world.updateForRound_IgnoringNotifications(uwpe);
		}

		Assert.isTrue(shipLoc.placeName.startsWith(Starsystem.name));
		Assert.isTrue(shipLoc.placeName.endsWith(starsystemBeyondLink));
		Assert.isTrue(starsystemsKnown.length == 2);
		Assert.isTrue(starsystemsKnown.indexOf(starsystemBeyondLink) >= 0);

		var starsystemArrivedAt =
			world.network.starsystemByName(starsystemBeyondLinkName);

		universe.venueNextSet(starsystemArrivedAt.toVenue()); // Can this be avoided?

		var planetsInStarsystemArrivedAt = starsystemArrivedAt.planets;
		var planetToColonize =
			planetsInStarsystemArrivedAt.find(x => x.factionable().faction(world) == null);

		if (planetToColonize != null)
		{
			shipOrder.defnSet
			(
				orderDefns.Go
			).entityBeingTargetedSet
			(
				planetToColonize
			);
			/*
			.assignToEntityOrderable
			(
				ship
			);
			*/

			while (shipOrder.isComplete == false)
			{
				var shipDeviceUser = ship.deviceUser();

				var shipEnergyBeforeMove = shipDeviceUser.energyRemainingThisRound();

				if (shipEnergyBeforeMove < shipDeviceUser.energyPerMove() )
				{
					world.updateForRound_IgnoringNotifications(uwpe);
				}
				else
				{
					while
					(
						shipOrder.isComplete == false
						&& shipDeviceUser.energyRemainingThisRound() == shipEnergyBeforeMove
					)
					{
						shipOrder.obey(uwpe);
						universe.updateForTimerTick();
					}
				}
			}

			Assert.isTrue(shipLoc.placeName.startsWith(Planet.name));
			Assert.isTrue(shipLoc.placeName.endsWith(planetToColonize.name));

			Assert.isNull(planetToColonize.factionable().faction(world) );

			var wasColonizationSuccessful =
				ship.planetColonize(universe, world);

			Assert.isTrue(wasColonizationSuccessful);

			var shipFaction = ship.factionable().faction(world);
			var planetToColonizeFaction = planetToColonize.factionable().faction(world);
			var starsystemArrivedAtFaction = starsystemArrivedAt.faction(world);

			Assert.areEqual(shipFaction, planetToColonizeFaction);
			Assert.areEqual(shipFaction, starsystemArrivedAtFaction);

			Assert.isTrue(factionUser.planets.indexOf(planetToColonize) >= 0);
		}
	}

}
