
class FactionKnowledge
{
	private factionSelfName: string;
	private factionNames: string[];
	private planetNames: string[];
	private shipIds: number[];
	private starsystemNames: string[];
	private linkNames: string[];

	private _factions: Faction[];
	private _factionsOther: Faction[];
	private _links: StarClusterLink[];
	private _ships: Ship[];
	private _starCluster: StarCluster;
	private _starsystems: Starsystem[];
	private _world: WorldExtended;

	constructor
	(
		factionSelfName: string,
		factionNames: string[],
		planetNames: string[],
		shipIds: number[],
		starsystemNames: string[],
		linkNames: string[]
	)
	{
		this.factionSelfName = factionSelfName;
		this.factionNames = factionNames || [];
		this.planetNames = planetNames || [];
		this.shipIds = shipIds || [];
		this.starsystemNames = starsystemNames || [];
		this.linkNames = linkNames || [];
	}

	static TextUnknownStarsystem = "Unknown Starsystem";

	static fromFactionSelfName(factionSelfName: string): FactionKnowledge
	{
		return new FactionKnowledge(factionSelfName, null, null, null, null, null);
	}

	factionAdd(factionToAdd: Faction, uwpe: UniverseWorldPlaceEntities): void
	{
		var wasFactionAlreadyKnown = this.factionIsKnown(factionToAdd);
		if (wasFactionAlreadyKnown == false)
		{
			var world = uwpe.world as WorldExtended;
			var factionSelf = this.factionSelf(world);

			var message =
				"The " + factionSelf.name
				+ " have made first contact with the " + factionToAdd.name + ".";

			var notification = new Notification2
			(
				message,
				() => { alert("todo - first contact") }
			);
			factionSelf.notificationAdd(notification);

			this.factionNames.push(factionToAdd.name);
			this.factionsCacheClear();
		}
	}

	factionSelf(world: WorldExtended): Faction
	{
		return world.starCluster.factionByName(this.factionSelfName);
	}

	factionIsKnown(factionToCheck: Faction): boolean
	{
		return this.factionNames.some(x => x == factionToCheck.name);
	}

	factions(world: WorldExtended): Faction[]
	{
		if (this._factions == null)
		{
			this._factions = world.factions().filter
			(
				x => this.factionNames.indexOf(x.name) >= 0
			);
		}

		return this._factions;
	}

	factionsCacheClear(): void
	{
		this._factions = null;
		this._factionsOther = null;
		this.worldCacheClear();
	}

	factionsOther(world: WorldExtended): Faction[]
	{
		if (this._factionsOther == null)
		{
			this._factionsOther =
				this.factions(world).filter(x => x.name != this.factionSelfName);
		}

		return this._factionsOther;
	}

	linkAdd(link: StarClusterLink): void
	{
		this.linkNames.push(link.name);
		this.linksCacheClear();
	}

	links(world: WorldExtended): StarClusterLink[]
	{
		if (this._links == null)
		{
			this._links = world.starCluster.links.filter
			(
				x => this.linkNames.indexOf(x.name) >= 0
			);
		}

		return this._links;
	}

	linksCacheClear(): void
	{
		this._links = null;
		this.starClusterCacheClear();
	}

	planetAdd(planet: Planet): void
	{
		if (this.planetIsKnown(planet) == false)
		{
			this.planetNames.push(planet.name);
		}
	}

	planetIsKnown(planet: Planet): boolean
	{
		return (this.planetNames.indexOf(planet.name) >= 0);
	}

	starCluster(world: WorldExtended): StarCluster
	{
		if (this._starCluster == null)
		{
			var starClusterActual = world.starCluster;
			var nodesActual = starClusterActual.nodes;

			var linksKnown = this.links(world);

			var nodesKnown = nodesActual.map
			(
				nodeActual =>
				{
					var returnValue;

					if (this.starsystemNames.indexOf(nodeActual.starsystem.name) >= 0)
					{
						returnValue = nodeActual;

						// hack
						// This was hard to debug.
						// Basically, the collider's center is being set
						// to the same as the Locatable's loc.pos
						// before the nodes are scaled to screen size,
						// while they're all still fractional,
						// and the collider centers for the known nodes
						// weren't being reset here like they were for the unknown ones.
						// This was happening even though the exact same instance of pos
						// is passed to the instantions of Locatable and Collidable,
						// because Collidable is implicitly cloning it.

						nodeActual.collidable().colliderResetToRestPosition();
					}
					else
					{
						returnValue = new StarClusterNode
						(
							FactionKnowledge.TextUnknownStarsystem, // name
							nodeActual.defn,
							nodeActual.locatable().loc.pos,
							nodeActual.starsystem.star,
							null // starsystem
						)
					}

					return returnValue;
				}
			);

			this._starCluster = new StarCluster
			(
				starClusterActual.name, nodesKnown, linksKnown, [] // factions
			);
		}

		return this._starCluster;
	}

	starClusterCacheClear(): void
	{
		this._starCluster = null;
		this.worldCacheClear();
	}

	shipAdd(ship: Ship, uwpe: UniverseWorldPlaceEntities): void
	{
		var shipId = ship.id;

		if (this.shipIds.indexOf(shipId) == -1)
		{
			this.shipIds.push(shipId);
			var shipFaction = ship.faction();
			this.factionAdd(shipFaction, uwpe);
		}

		this.shipsCacheClear();
	}

	ships(world: WorldExtended): Ship[]
	{
		if (this._ships == null)
		{
			var factionsKnown = this.factions(world);
			var shipsActualForFactionsKnown =
				factionsKnown.map(f => f.ships);
			var shipsActualAll =
				ArrayHelper.flattenArrayOfArrays(shipsActualForFactionsKnown);
			this._ships = shipsActualAll.filter
			(
				x => this.shipIds.indexOf(x.id) >= 0
			);
		}

		return this._ships;
	}

	shipsCacheClear(): void
	{
		this._ships = null;
		this.factionsCacheClear();
	}

	starsystemAdd(starsystem: Starsystem, uwpe: UniverseWorldPlaceEntities): void
	{
		var starsystemName = starsystem.name;

		var starsystemIsNotYetKnown =
			(this.starsystemIsKnown(starsystem) == false);

		if (starsystemIsNotYetKnown)
		{
			this.starsystemNames.push(starsystemName);

			var world = uwpe.world as WorldExtended;
			var starsystemFaction = starsystem.faction(world);

			var starCluster = world.starCluster;
			var linkPortals = starsystem.linkPortals;

			for (var i = 0; i < linkPortals.length; i++)
			{
				var linkPortal = linkPortals[i];
				var link = linkPortal.link(starCluster);
				this.linkAdd(link);
			}

			var factionSelf = this.factionSelf(world);

			var message =
				"The " + factionSelf.name + " have discovered the "
				+ starsystem.name
				+ " system.  It contains "
				+ starsystem.planets.length + " planets and links to "
				+ starsystem.linkPortals.length + " other systems.";

			if (starsystemFaction != null)
			{
				message += "  It is claimed by the " + starsystemFaction.name + ".";
			}

			var notification = new Notification2
			(
				message,
				() => starsystem.jumpTo(universe)
			);

			var factionSelf = this.factionSelf(world);

			factionSelf.notificationSession.notificationAdd(notification);

			if (starsystemFaction != null)
			{
				this.factionAdd(starsystemFaction, uwpe);
			}

			var universe = uwpe.universe;
			factionSelf.notificationSessionStart(universe, universe.display.sizeInPixelsHalf);

			world.starCluster.roundAdvanceUntilNotificationDisable();
		}

		this.starsystemsCacheClear();
	}

	starsystemIsKnown(starsystem: Starsystem): boolean
	{
		return this.starsystemWithNameIsKnown(starsystem.name);
	}

	starsystemWithNameIsKnown(starsystemName: string): boolean
	{
		return (this.starsystemNames.indexOf(starsystemName) >= 0);
	}

	starsystems(world: WorldExtended): Starsystem[]
	{
		if (this._starsystems == null)
		{
			var nodesKnown = world.starCluster.nodes.filter
			(
				x => this.starsystemNames.indexOf(x.starsystem.name) >= 0
			);
			this._starsystems = nodesKnown.map(x => x.starsystem);
		}

		return this._starsystems;
	}

	starsystemsCacheClear(): void
	{
		this._starsystems = null;
		this.starClusterCacheClear();
	}

	tradeLinksWith
	(
		factionOther: Faction,
		world: WorldExtended
	): FactionKnowledgeTrade_Links
	{
		var factionSelf = this.factionSelf(world);

		var linksKnownBySelf = this.links(world);
		var linksKnownByOther = factionOther.knowledge.links(world);

		var linksKnownBySelfButNotOther = linksKnownBySelf.filter
		(
			x => linksKnownByOther.indexOf(x) == -1
		);

		var linksKnownByOtherButNotSelf = linksKnownByOther.filter
		(
			x => linksKnownBySelf.indexOf(x) == -1
		);

		var linkKnownBySelfButNotOther =
			linksKnownBySelfButNotOther[0];

		var linkKnownByOtherButNotSelf =
			linksKnownByOtherButNotSelf[0];

		var returnTrade = new FactionKnowledgeTrade_Links
		(
			[ factionSelf, factionOther ],
			[
				linkKnownBySelfButNotOther,
				linkKnownByOtherButNotSelf
			]
		);

		return returnTrade;
	}

	tradeStarsystemsWith
	(
		factionOther: Faction,
		world: WorldExtended
	): FactionKnowledgeTrade_Starsystems
	{
		var factionSelf = this.factionSelf(world);

		var starsystemsKnownBySelf = this.starsystems(world);
		var starsystemsKnownByOther = factionOther.knowledge.starsystems(world);

		var starsystemsKnownBySelfButNotOther = starsystemsKnownBySelf.filter
		(
			x => starsystemsKnownByOther.indexOf(x) == -1
		);

		var starsystemsKnownByOtherButNotSelf = starsystemsKnownByOther.filter
		(
			x => starsystemsKnownBySelf.indexOf(x) == -1
		);

		var starsystemKnownBySelfButNotOther =
			starsystemsKnownBySelfButNotOther[0];

		var starsystemKnownByOtherButNotSelf =
			starsystemsKnownByOtherButNotSelf[0];

		var returnTrade = new FactionKnowledgeTrade_Starsystems
		(
			[ factionSelf, factionOther ],
			[
				starsystemKnownBySelfButNotOther,
				starsystemKnownByOtherButNotSelf
			]
		);

		return returnTrade;
	}

	tradeTechnologiesWith
	(
		factionOther: Faction,
		world: WorldExtended
	): FactionKnowledgeTrade_Technologies
	{
		var factionSelf = this.factionSelf(world);

		var technologiesKnownBySelf =
			factionSelf.technologyResearcher.technologiesKnown(world);
		var technologiesKnownByOther =
			factionOther.technologyResearcher.technologiesKnown(world);

		var technologiesKnownBySelfButNotOther = technologiesKnownBySelf.filter
		(
			x => technologiesKnownByOther.indexOf(x) == -1
		);

		var technologiesKnownByOtherButNotSelf = technologiesKnownByOther.filter
		(
			x => technologiesKnownBySelf.indexOf(x) == -1
		);

		var technologyKnownBySelfButNotOther =
			technologiesKnownBySelfButNotOther[0];

		var technologyKnownByOtherButNotSelf =
			technologiesKnownByOtherButNotSelf[0];

		var returnTrade = new FactionKnowledgeTrade_Technologies
		(
			[ factionSelf, factionOther ],
			[
				technologyKnownBySelfButNotOther,
				technologyKnownByOtherButNotSelf
			]
		);

		return returnTrade;
	}

	world(universe: Universe, worldActual: WorldExtended): WorldExtended
	{
		if (this._world == null)
		{
			var starClusterKnown = this.starCluster(worldActual);

			this._world = new WorldExtended
			(
				worldActual.name,
				worldActual.dateCreated,
				worldActual.defn.activityDefns,
				worldActual.buildableDefns,
				worldActual.technologyGraph,
				worldActual.camera,
				starClusterKnown
			);
		}

		return this._world;
	}

	worldCacheClear(): void
	{
		this._world = null;
	}
}
