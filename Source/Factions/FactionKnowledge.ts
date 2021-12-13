
class FactionKnowledge
{
	factionNames: string[];
	starsystemNames: string[];
	linkNames: string[];

	factionsKnown: Faction[];
	_worldKnown: WorldExtended;

	constructor
	(
		factionNames: string[],
		starsystemNames: string[],
		linkNames: string[]
	)
	{
		this.factionNames = factionNames || [];
		this.starsystemNames = starsystemNames || [];
		this.linkNames = linkNames || [];
	}

	static default(): FactionKnowledge
	{
		return new FactionKnowledge(null, null, null)
	}

	worldKnown(universe: Universe, worldActual: WorldExtended): WorldExtended
	{
		if (this._worldKnown == null)
		{
			var networkActual = worldActual.network;

			var nodesActual = networkActual.nodes;
			var nodesKnown = [];
			for (var i = 0; i < nodesActual.length; i++)
			{
				var node = nodesActual[i];
				var starsystemName = node.starsystem.name;
				if (ArrayHelper.contains(this.starsystemNames, starsystemName))
				{
					nodesKnown.push(node);
				}
				else
				{
					var nodeDummy = new NetworkNode2
					(
						"?", // name
						node.defn,
						node.locatable().loc.pos,
						null // starsystem
					);
					nodesKnown.push(nodeDummy);
				}
			}

			var linksActual = networkActual.links;
			var linksKnown = [];
			for (var i = 0; i < linksActual.length; i++)
			{
				var link = linksActual[i];
				var linkName = link.name;
				if (ArrayHelper.contains(this.linkNames, linkName))
				{
					linksKnown.push(link);
				}
			}

			var networkKnown = new Network2
			(
				networkActual.name, nodesKnown, linksKnown
			);

			var factionsKnown = new Array<Faction>();

			/*
			var factionsActual = worldActual.factions;
			for (var i = 0; i < factionsActual.length; i++)
			{
				var faction = factionsActual[i];
				// todo
			}
			*/

			this._worldKnown = new WorldExtended
			(
				worldActual.name,
				worldActual.dateCreated,
				worldActual.defn.activityDefns,
				worldActual.buildableDefns,
				worldActual.deviceDefns,
				worldActual.technologyGraph,
				networkKnown,
				factionsKnown,
				worldActual.ships, // todo
				worldActual.camera
			);
		}

		return this._worldKnown;
	}

	worldKnownUpdate(): void
	{
		this._worldKnown = null;
	}
}
