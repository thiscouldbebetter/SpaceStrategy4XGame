
class FactionNames
{
	static _instance: FactionNames;
	static Instance(): FactionNames
	{
		if (FactionNames._instance == null)
		{
			FactionNames._instance = new FactionNames();
		}
		return FactionNames._instance;
	}

	_All: string[]

	constructor()
	{
		this._All =
			this.namesAlternate();
			//this.namesDescriptive();
			//this.namesLegacy();
	}

	namesAlternate(): string[]
	{
		var returnValues =
		[
			"Astril",
			"Bulvan",
			"Drex",
			"Eldor",
			"Fulbi",
			"Grast",
			"Hemmeran",
			"Ildun",
			"Jarrae",
			"Kwarg",
			"Lacresa",
			"Mooldug",
			"Opretti",
			"Panquel",
			"Restrin",
			"Sivulan",
			"Trontar",
			"Ullex",
			"Wolto",
			"Yan",
			"Zonnet"
		];

		return returnValues;
	}

	namesDescriptive(): string[]
	{
		var returnValues =
		[
			"Adaptable",
			"Charming",
			"Clairvoyant",
			"Cramming",
			"Disruptive",
			"Energetic",
			"Enervating",
			"Farsighted",
			"Hermited",
			"Inspired",
			"Intractable",
			"Invasive",
			"Larcenous",
			"Manipulative",
			"Nurturing",
			"Prolific",
			"Regenerative",
			"Speedy",
			"Telepathic",
			"Tough",
			"Xenophobic"
		];

		return returnValues;
	}

	namesLegacy(): string[]
	{
		var returnValues =
		[
			"Orfa",
			"Baliflids",
			"Kambuchka",
			"Nimbuloids",
			"Ungooma",
			"Swaparamans",
			"Shevar",
			"Oculons",
			"Arbryls",
			"Chamachies",
			"Capelons",
			"Minions",
			"Dubtaks",
			"Marmosians",
			"Govorom",
			"Mebes",
			"Fludentri",
			"Chronomyst",
			"Hanshaks",
			"Snovedomas",
			"Frutmaka"
		];

		return returnValues;
	}

}
