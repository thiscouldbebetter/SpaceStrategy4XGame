
function FactionKnowledge(factionNames, starsystemNames, linkNames)
{
	this.factionNames = factionNames;
	this.starsystemNames = starsystemNames;
	this.linkNames = linkNames;
}
{
	FactionKnowledge.prototype.worldKnown = function(universe, worldActual)
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
				if (this.starsystemNames.contains(starsystemName) == true)
				{
					nodesKnown.push(node);
				}
				else
				{
					var nodeDummy = new NetworkNode
					(
						"?", // name
						node.defn,
						node.loc.pos,
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
				if (this.linkNames.contains(linkName) == true)
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
	};

	FactionKnowledge.prototype.worldKnownUpdate = function()
	{
		this._worldKnown = null;
	};
}
