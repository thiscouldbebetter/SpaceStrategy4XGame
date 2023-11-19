
class FactionKnowledge
{
	private factionSelfName: string;
	private factionNames: string[];
	private shipIds: number[];
	private starsystemNames: string[];
	private linkNames: string[];

	private _factions: Faction[];
	private _factionsOther: Faction[];
	private _network: Network2;
	private _links: NetworkLink2[];
	private _ships: Ship[];
	private _starsystems: Starsystem[];
	private _world: WorldExtended;

	constructor
	(
		factionSelfName: string,
		factionNames: string[],
		shipIds: number[],
		starsystemNames: string[],
		linkNames: string[]
	)
	{
		this.factionSelfName = factionSelfName;
		this.factionNames = factionNames || [];
		this.shipIds = shipIds || [];
		this.starsystemNames = starsystemNames || [];
		this.linkNames = linkNames || [];
	}

	static fromFactionSelfName(factionSelfName: string): FactionKnowledge
	{
		return new FactionKnowledge(factionSelfName, null, null, null, null);
	}

	factionSelf(world: WorldExtended): Faction
	{
		return world.factionByName(this.factionSelfName);
	}

	factionAdd(factionToAdd: Faction): void
	{
		this.factionNames.push(factionToAdd.name);
		this.factionsCacheClear();
	}

	factions(world: WorldExtended): Faction[]
	{
		if (this._factions == null)
		{
			this._factions = world.factions.filter
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

	linkAdd(link: NetworkLink2): void
	{
		this.linkNames.push(link.name);
		this.linksCacheClear();
	}

	links(world: WorldExtended): NetworkLink2[]
	{
		if (this._links == null)
		{
			this._links = world.network.links.filter
			(
				x => this.linkNames.indexOf(x.name) >= 0
			);
		}

		return this._links;
	}

	linksCacheClear(): void
	{
		this._links = null;
		this.networkCacheClear();
	}

	network(world: WorldExtended): Network2
	{
		if (this._network == null)
		{
			var networkActual = world.network;
			var nodesActual = networkActual.nodes;

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
						returnValue = new NetworkNode2
						(
							"?", // name
							nodeActual.defn,
							nodeActual.locatable().loc.pos,
							null // starsystem
						)
					}

					return returnValue;
				}
			);

			this._network = new Network2
			(
				networkActual.name, nodesKnown, linksKnown
			);
		}

		return this._network;
	}

	networkCacheClear(): void
	{
		this._network = null;
		this.worldCacheClear();
	}

	shipAdd(ship: Ship, world: WorldExtended): void
	{
		var shipId = ship.id;

		if (this.shipIds.indexOf(shipId) == -1)
		{
			this.shipIds.push(shipId);
			var shipFaction = ship.faction(world);
			this.factionAdd(shipFaction);
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

	starsystemAdd(starsystem: Starsystem, world: WorldExtended): void
	{
		var starsystemName = starsystem.name;

		if (this.starsystemNames.indexOf(starsystemName) == -1)
		{
			this.starsystemNames.push(starsystemName);

			var starsystemFaction = starsystem.faction(world);
			this.factionAdd(starsystemFaction);

			var network = world.network;
			var linkPortals = starsystem.linkPortals;

			for (var i = 0; i < linkPortals.length; i++)
			{
				var linkPortal = linkPortals[i];
				var link = linkPortal.link(network);
				this.linkAdd(link);
			}
		}

		this.starsystemsCacheClear();
	}

	starsystems(world: WorldExtended): Starsystem[]
	{
		if (this._starsystems == null)
		{
			var nodesKnown = world.network.nodes.filter
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
		this.networkCacheClear();
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
			var networkKnown = this.network(worldActual);
			var factionsKnown = this.factions(worldActual);
			var shipsKnown = this.ships(worldActual);

			this._world = new WorldExtended
			(
				worldActual.name,
				worldActual.dateCreated,
				worldActual.defn.activityDefns,
				worldActual.buildableDefns,
				worldActual.deviceDefns,
				worldActual.technologyGraph,
				networkKnown,
				factionsKnown,
				shipsKnown, // todo
				worldActual.camera
			);
		}

		return this._world;
	}

	worldCacheClear(): void
	{
		this._world = null;
	}
}
