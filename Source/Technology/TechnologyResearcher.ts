
class TechnologyResearcher
{
	factionName: string;
	nameOfTechnologyBeingResearched: string;
	researchAccumulated: number;
	namesOfTechnologiesKnown: string[];

	name: string;

	constructor
	(
		factionName: string,
		nameOfTechnologyBeingResearched: string,
		researchAccumulated: number,
		namesOfTechnologiesKnown: string[]
	)
	{
		this.factionName = factionName;
		this.nameOfTechnologyBeingResearched = nameOfTechnologyBeingResearched;
		this.researchAccumulated = researchAccumulated;
		this.namesOfTechnologiesKnown = namesOfTechnologiesKnown;

		this.name = this.factionName + " Research";
	}

	static default(): TechnologyResearcher
	{
		return new TechnologyResearcher
		(
			"[factionName]",
			null, // nameOfTechnologyBeingResearched
			0, // researchAccumulated
			[], // namesOfTechnologiesKnown
		);
	}

	buildablesAvailable(world: WorldExtended): any[]
	{
		var returnValues = [];

		var technologiesByName = world.technologyTree.technologiesByName;

		for (var i = 0; i < this.namesOfTechnologiesKnown.length; i++)
		{
			var technologyName = this.namesOfTechnologiesKnown[i];
			var technology = technologiesByName.get(technologyName);
			var technologyBuildables = technology.buildablesEnabled(world);
			returnValues.push(...technologyBuildables);
		}

		return returnValues;
	}

	researchAccumulatedIncrement
	(
		world: WorldExtended, faction: Faction, amountToIncrement: number
	): void
	{
		var technologyBeingResearched = this.technologyBeingResearched(world);

		if (technologyBeingResearched == null)
		{
			var notification = new Notification2
			(
				"Default", world.turnsSoFar, "Nothing being researched.", "research" // locus
			);
			faction.notificationSession.notifications.push(notification);
		}
		else
		{
			this.researchAccumulated += amountToIncrement;

			var researchRequired = technologyBeingResearched.researchRequired;
			if (this.researchAccumulated >= researchRequired)
			{
				this.namesOfTechnologiesKnown.push
				(
					this.nameOfTechnologyBeingResearched
				);
				this.nameOfTechnologyBeingResearched = null;
				this.researchAccumulated = 0;
			}
		}
	}

	strength(world: WorldExtended): number
	{
		var returnValue = 0;

		var technologiesKnown = this.technologiesKnown(world);
		for (var i = 0; i < technologiesKnown.length; i++)
		{
			var tech = technologiesKnown[i];
			returnValue += tech.strength(world);
		}

		return returnValue;
	}

	technologiesAvailableForResearch
	(
		world: WorldExtended
	): Technology[]
	{
		var technologyTree = world.technologyTree;
		var technologiesAll = technologyTree.technologies;

		var returnValues = technologiesAll.filter
		(
			x => this.technologyIsAvailableForResearch(x)
		);

		return returnValues;
	}

	technologiesKnown(world: WorldExtended): Technology[]
	{
		var returnValues = [];

		for (var i = 0; i < this.namesOfTechnologiesKnown.length; i++)
		{
			var techName = this.namesOfTechnologiesKnown[i];
			var technology = world.technologyTree.technologyByName(techName);
			returnValues.push(technology);
		}

		return returnValues;
	}

	technologyBeingResearched(world: WorldExtended): Technology
	{
		var technologyTree = world.technologyTree;

		var returnValue =
			technologyTree.technologyByName(this.nameOfTechnologyBeingResearched);

		return returnValue;
	}

	technologyIsAvailableForResearch(technologyToCheck: Technology): boolean
	{
		var returnValue = false;

		var technologyToCheckName = technologyToCheck.name;

		var isAlreadyKnown =
			(this.namesOfTechnologiesKnown.indexOf(technologyToCheckName) >= 0);

		if (isAlreadyKnown == false)
		{
			var prerequisites =
				technologyToCheck.namesOfPrerequisiteTechnologies;

			var areAllPrerequisitesKnownSoFar = true;

			for (var p = 0; p < prerequisites.length; p++)
			{
				var prerequisite = prerequisites[p];
				var isPrerequisiteKnown =
				(
					this.namesOfTechnologiesKnown.indexOf(prerequisite) >= 0
				);

				if (isPrerequisiteKnown == false)
				{
					areAllPrerequisitesKnownSoFar = false;
					break;
				}
			}

			if (areAllPrerequisitesKnownSoFar)
			{
				returnValue = true;
			}
		}

		return returnValue;
	}

	technologyIsKnown(technologyToCheck: Technology): boolean
	{
		var technologyToCheckName = technologyToCheck.name;
		var isKnown = this.namesOfTechnologiesKnown.some
		(
			x => x == technologyToCheckName
		);
		return isKnown;
	}

	technologyResearch(technologyToResearch: Technology): void
	{
		var isAvailable = this.technologyIsAvailableForResearch
		(
			technologyToResearch
		);

		if (isAvailable)
		{
			this.nameOfTechnologyBeingResearched = technologyToResearch.name;
		}
		else
		{
			throw Error("Technology not available for research!");
		}
	}

	// turns

	updateForTurn
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): void
	{
		var researchThisTurn = faction.researchPerTurn(universe, world);
		this.researchAccumulatedIncrement(world, faction, researchThisTurn);
	}
}
