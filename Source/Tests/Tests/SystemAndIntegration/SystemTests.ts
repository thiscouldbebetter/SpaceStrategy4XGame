
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
		var factionUser = world.factions()[0];
		var planetUser = factionUser.planetHome(world);

		var buildableDefns = BuildableDefnsLegacy.Instance(Coords.ones());

		this.playFromStart_BuildLaboratory(universe, buildableDefns, planetUser);

		this.playFromStart_ResearchTechnologiesForShips
		(
			universe, factionUser
		);

		this.playFromStart_BuildShipyard
		(
			universe, planetUser, buildableDefns
		);

		var ship = this.playFromStart_BuildShip
		(
			universe,
			factionUser,
			planetUser,
			buildableDefns
		);

		var starsystemArrivedAt = this.playFromStart_GoToNeighboringStarsystem
		(
			universe, factionUser, planetUser, ship
		);

		this.playFromStart_ColonizePlanetWithShipInStarsystem
		(
			ship, starsystemArrivedAt, universe
		);
	}

	playFromStart_BuildLaboratory
	(
		universe: Universe,
		buildableDefns: BuildableDefnsLegacy,
		planetUser: Planet
	): void
	{
		var positionsAvailableToBuildAt =
			planetUser.cellPositionsAvailableToBuildOnSurface(universe);
		var posToBuildAt = positionsAvailableToBuildAt[0];

		var buildableLaboratory =
			Buildable.fromDefnAndPosIncomplete(buildableDefns.SurfaceLaboratory, posToBuildAt);

		var buildableLabAsEntity = buildableLaboratory.toEntity(world);
		planetUser.buildableEntityBuild(universe, buildableLabAsEntity);

		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		while (buildableLaboratory.isComplete == false)
		{
			var world = universe.world as WorldExtended;
			world.updateForRound_IgnoringNotifications(uwpe);
		}

		Assert.isTrue(buildableLaboratory.isComplete);
	}

	playFromStart_ResearchTechnologiesForShips
	(
		universe: Universe, factionUser: Faction
	): void
	{
		var tn = new TechnologyNamesLegacy();

		var technologiesNeededToBuildShipNames =
		[
			tn.OrbitalStructures,
			tn.InterplanetaryExploration,
			tn.TonklinDiary,
			tn.Xenobiology,
			tn.EnvironmentalEncapsulation,
			tn.SpectralAnalysis,
			tn.Superconductivity,
			tn.SpacetimeSurfing
		];

		var researcher = factionUser.technologyResearcher;
		var world = universe.world as WorldExtended;
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, null, null, null // todo
		);


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

			// If WorldExtendedCreator.isDebuggingMode is set (hardcoded!),
			// then some technologies might already be known.
			if (technologyToResearch != null)
			{
				researcher.technologyResearch(technologyToResearch);

				var hasTechnologyBeenDiscoveredYet = false;
				while (hasTechnologyBeenDiscoveredYet == false)
				{
					world.updateForRound_IgnoringNotifications(uwpe);

					hasTechnologyBeenDiscoveredYet =
						researcher.technologyIsKnown(technologyToResearch);
				}
			}
		}
	}

	playFromStart_BuildShipyard
	(
		universe: Universe,
		planetUser: Planet,
		buildableDefns: BuildableDefnsLegacy
	): void
	{
		var positionsAvailableToBuildAt =
			planetUser.cellPositionsAvailableToOccupyInOrbit(universe);
		var posToBuildAt = positionsAvailableToBuildAt[0];

		var buildableShipyard = Buildable.fromDefnAndPosIncomplete
		(
			buildableDefns.OrbitalShipyard, posToBuildAt
		);
		var world = universe.world as WorldExtended;
		var shipyardEntity = buildableShipyard.toEntity(world);
		planetUser.buildableEntityBuild(universe, shipyardEntity);

		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);

		while (buildableShipyard.isComplete == false)
		{
			world.updateForRound_IgnoringNotifications(uwpe);
		}
	}

	playFromStart_BuildShip
	(
		universe: Universe,
		factionUser: Faction,
		planetUser: Planet,
		buildableDefns: BuildableDefnsLegacy
	): Ship
	{
		planetUser.jumpTo(universe); // Sets up a VenueLayout.
		var venueNext = universe.venueNext() as VenueFader;
		var venuePlanetUserLayout =
			venueNext.venueToFadeTo() as VenueLayout;

		var shipyard = new ShipBuilder(venuePlanetUserLayout);

		shipyard.buildablesAvailableInitialize(universe);

		shipyard.hullSizeSelectDefault();

		var shipComponentsAsBuildableDefns =
		[
			buildableDefns.ShipDrive1TonklinMotor,
			buildableDefns.ShipGenerator1ProtonShaver,
			buildableDefns.ShipItemColonizer,
			buildableDefns.ShipItemColonizer,
			buildableDefns.ShipStarlaneDrive1StarLaneDrive
		];

		for (var i = 0; i < shipComponentsAsBuildableDefns.length; i++)
		{
			var component = shipComponentsAsBuildableDefns[i];
			shipyard.componentAddToBuild(component);
		}

		var ship = shipyard.build
		(
			universe,
			factionUser,
			universe.display.sizeInPixels // sizeDialog
		);

		Assert.isNotNull(ship);

		return ship;
	}

	playFromStart_GoToNeighboringStarsystem
	(
		universe: Universe, factionUser: Faction, planetUser: Planet, ship: Ship
	): Starsystem
	{
		var world = universe.world as WorldExtended;

		var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld
		(
			universe, world
		);
		ship.planetOrbitExit(planetUser, uwpe);

		var starsystemUser = factionUser.starsystemHome(world);
		var linkPortalToGoTo = starsystemUser.linkPortals[0];

		Assert.isNotNull(linkPortalToGoTo);

		var starsystemBeyondLinkName =
			linkPortalToGoTo.name.split(" to ")[1];

		var network = world.starCluster;
		var starsystemBeyondLink = network.starsystemByName(starsystemBeyondLinkName);

		var factionUserKnowledge = factionUser.knowledge;
		var starsystemsKnown = factionUserKnowledge.starsystems(world);
		Assert.isTrue(starsystemsKnown.length == 1);

		this.moveShipInStarsystemUntilItReachesEntity
		(
			ship, starsystemUser, linkPortalToGoTo, universe
		);

		universe.venueNextSet(null);
		universe.updateForTimerTick();

		var shipLoc = ship.locatable().loc;

		while (shipLoc.placeName().startsWith(StarClusterLink.name))
		{
			var uwpe = new UniverseWorldPlaceEntities
			(
				universe, world, null, ship, null
			);

			world.updateForRound_IgnoringNotifications(uwpe);
		}

		var shipPlaceName = shipLoc.placeName();
		Assert.isTrue(shipPlaceName.startsWith(Starsystem.name));
		Assert.isTrue(shipPlaceName.endsWith(starsystemBeyondLink.name));
		starsystemsKnown = factionUserKnowledge.starsystems(world);
		Assert.isTrue(starsystemsKnown.length == 2);
		Assert.isTrue(starsystemsKnown.indexOf(starsystemBeyondLink) >= 0);

		return starsystemBeyondLink;
	}


	playFromStart_ColonizePlanetWithShipInStarsystem
	(
		ship: Ship,
		starsystemArrivedAt: Starsystem,
		universe: Universe
	): void
	{
		var world = universe.world as WorldExtended;
		var factionUser = world.factions()[0];

		universe.venueNextSet(starsystemArrivedAt.toVenue()); // Can this be avoided?
		universe.updateForTimerTick();

		var planetsInStarsystemArrivedAt = starsystemArrivedAt.planets;
		var planetToColonize =
			planetsInStarsystemArrivedAt.find(x => x.factionable().faction() == null);

		if (planetToColonize == null)
		{
			// todo - Make sure this doesn't happen.
			throw new Error("No planet to colonize!");
		}
		else
		{
			this.moveShipInStarsystemUntilItReachesEntity
			(
				ship, starsystemArrivedAt, planetToColonize, universe
			);

			var shipLoc = ship.locatable().loc;

			var shipLocPlaceName = shipLoc.placeName();
			Assert.isTrue(shipLocPlaceName.startsWith(Planet.name));
			Assert.isTrue(shipLocPlaceName.endsWith(planetToColonize.name));

			Assert.isNull(planetToColonize.factionable().faction() );

			var wasColonizationSuccessful =
				ship.planetColonize(universe, world);

			Assert.isTrue(wasColonizationSuccessful);

			var shipFaction = ship.factionable().faction();
			var planetToColonizeFaction = planetToColonize.factionable().faction();
			var starsystemArrivedAtFaction = starsystemArrivedAt.faction(world);

			Assert.areEqual(shipFaction, planetToColonizeFaction);
			Assert.areEqual(shipFaction, starsystemArrivedAtFaction);

			Assert.isTrue(factionUser.planets.indexOf(planetToColonize) >= 0);
		}
	}

	// Helpers.

	moveShipInStarsystemUntilItReachesEntity
	(
		ship: Ship, starsystem: Starsystem, entityToGoTo: Entity, universe: Universe
	): void
	{
		universe.venueNextSet(starsystem.toVenue() );
		universe.updateForTimerTick();

		var orderDefns = OrderDefn.Instances();

		var shipOrder = Order.fromDefn
		(
			orderDefns.Go
		).entityBeingOrderedSet
		(
			ship
		).entityBeingTargetedSet
		(
			entityToGoTo
		);

		ship.orderSet(shipOrder);

		var world = universe.world as WorldExtended;

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, ship, null
		);

		var shipOrder = ship.order();

		while (shipOrder.isNothing() == false)
		{
			var shipDeviceUser = ship.deviceUser();

			var shipEnergyBeforeMove =
				shipDeviceUser.energyRemainingThisRound(uwpe);

			var shipEnergyPerMove = shipDeviceUser.energyPerMove();

			if (shipEnergyBeforeMove < shipEnergyPerMove)
			{
				world.updateForRound_IgnoringNotifications(uwpe);
			}
			else
			{
				shipOrder.obey(uwpe);

				var shipActor = ship.actor();
				var shipActivity = shipActor.activity;
				while (shipActivity.isDoNothing() == false)
				{
					universe.updateForTimerTick();
				}
			}
		}

		// There's something weird going on with these two lines.
		shipOrder.clear();
		shipOrder.isCompleteSet(false); // hack - This shouldn't be necessary, but is.

	}

}
