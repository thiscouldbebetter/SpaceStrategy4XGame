
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

	technologiesAvailable
	(
		technologyResearchSession: TechnologyResearchSession
	): any[]
	{
		var technologyTree = technologyResearchSession.technologyTree;
		var technologies = technologyTree.technologies;
		var technologiesKnown = this.namesOfTechnologiesKnown;
		var technologiesUnknown = [];

		for (var i = 0; i < technologies.length; i++)
		{
			var technology = technologies[i];
			var technologyName = technology.name;

			var isAlreadyKnown = (technologiesKnown.indexOf(technologyName) >= 0);

			if (isAlreadyKnown == false)
			{
				technologiesUnknown.push(technology);
			}
		}

		var technologiesUnknownWithKnownPrerequisites = [];

		for (var i = 0; i < technologiesUnknown.length; i++)
		{
			var technology = technologiesUnknown[i];
			var prerequisites = technology.namesOfPrerequisiteTechnologies;

			var areAllPrerequisitesKnown = true;

			for (var p = 0; p < prerequisites.length; p++)
			{
				var prerequisite = prerequisites[p];
				var isPrerequisiteKnown =
				(
					technologiesKnown.indexOf(prerequisite) >= 0
				);

				if (isPrerequisiteKnown == false)
				{
					areAllPrerequisitesKnown = false;
					break;
				}
			}

			if (areAllPrerequisitesKnown)
			{
				technologiesUnknownWithKnownPrerequisites.push
				(
					technology
				);
			}
		}

		return technologiesUnknownWithKnownPrerequisites;
	}

	technologiesKnown(world: WorldExtended): any[]
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
