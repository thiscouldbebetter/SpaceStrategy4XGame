
class FactionKnowledge
{
	constructor(factionNames, starsystemNames, linkNames)
	{
		this.factionNames = factionNames;
		this.starsystemNames = starsystemNames;
		this.linkNames = linkNames;
	}

	worldKnown(universe, worldActual)
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
					var nodeDummy = new NetworkNode
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

			var networkKnown = new Network
			(
				networkActual.name,
				nodesKnown,
				linksKnown
			);

			var factionsActual = worldActual.factions;
			var factionsKnown = [];
			for (var i = 0; i < factionsActual.length; i++)
			{
				var faction = factionsActual[i];
			}

			this._worldKnown = new World
			(
				worldActual.name,
				worldActual.dateCreated,
				worldActual.activityDefns,
				worldActual.buildables,
				worldActual.technologyTree,
				networkKnown,
				factionsKnown,
				worldActual.ships, // todo
				worldActual.camera
			);
		}

		return this._worldKnown;
	}

	worldKnownUpdate()
	{
		this._worldKnown = null;
	}
}
