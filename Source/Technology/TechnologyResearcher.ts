
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

		var technologiesByName = world.technologyGraph.technologiesByName;

		for (var i = 0; i < this.namesOfTechnologiesKnown.length; i++)
		{
			var technologyName = this.namesOfTechnologiesKnown[i];
			var technology = technologiesByName.get(technologyName);
			var technologyBuildables = technology.buildablesEnabled(world);
			returnValues.push(...technologyBuildables);
		}

		return returnValues;
	}

	faction(world: WorldExtended): Faction
	{
		return world.factionByName(this.factionName);
	}

	notificationBuildNothingBeingResearched
	(
		universe: Universe, world: WorldExtended
	): Notification2
	{
		var technologyResearcher = this;

		var faction = this.faction(world);
		var notification = new Notification2
		(
			"The " + faction.name + " have research facilities, but nothing is being researched.",
			() =>
			{
				var session = technologyResearcher.toSession(world.technologyGraph);
				var venueNext = session.toControl(universe, universe.display.sizeInPixels).toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		return notification;
	}

	notificationsForRoundAddToArray
	(
		universe: Universe,
		notificationsSoFar: Notification2[]
	): Notification2[]
	{
		var world = universe.world as WorldExtended;

		var techBeingResearched = this.technologyBeingResearched(world);

		if (techBeingResearched == null)
		{
			var researchPerTurn = this.researchPerTurn(universe, world);

			if (researchPerTurn > 0)
			{
				var notification =
					this.notificationBuildNothingBeingResearched(universe, world);

				notificationsSoFar.push(notification);
			}
		}

		return notificationsSoFar;
	}

	researchAccumulatedIncrement
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		amountToIncrement: number
	): void
	{
		var technologyBeingResearched = this.technologyBeingResearched(world);

		if (technologyBeingResearched == null)
		{
			if (amountToIncrement > 0)
			{
				var notification = this.notificationBuildNothingBeingResearched(universe, world);
				faction.notificationAdd(notification);
			}
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

				var technologyResearcher = this;
				var notification = new Notification2
				(
					"The " + faction.name + " have discovered the technology of " + technologyBeingResearched.name + ".",
					() =>
					{
						var session = technologyResearcher.toSession(world.technologyGraph);
						var venueNext = session.toControl(universe, universe.display.sizeInPixels).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				);
				faction.notificationAdd(notification);
			}
		}
	}

	researchPerTurn(universe: Universe, world: WorldExtended): number
	{
		var faction = this.faction(world);
		var returnValue = faction.researchPerTurn(universe, world);
		return returnValue;
	}

	strategicValue(world: WorldExtended): number
	{
		var returnValue = 0;

		var technologiesKnown = this.technologiesKnown(world);
		for (var i = 0; i < technologiesKnown.length; i++)
		{
			var tech = technologiesKnown[i];
			returnValue += tech.strategicValue(world);
		}

		return returnValue;
	}

	technologiesAvailableForResearch
	(
		world: WorldExtended
	): Technology[]
	{
		var technologyGraph = world.technologyGraph;
		var technologiesAll = technologyGraph.technologies;

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
			var technology = world.technologyGraph.technologyByName(techName);
			returnValues.push(technology);
		}

		return returnValues;
	}

	technologyBeingResearched(world: WorldExtended): Technology
	{
		var technologyGraph = world.technologyGraph;

		var returnValue =
			technologyGraph.technologyByName(this.nameOfTechnologyBeingResearched);

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

	toSession(technologyGraph: TechnologyGraph): TechnologyResearchSession
	{
		return new TechnologyResearchSession(technologyGraph, this);
	}

	// turns

	updateForRound
	(
		universe: Universe, world: WorldExtended, faction: Faction
	): void
	{
		var researchThisTurn = this.researchPerTurn(universe, world);
		this.researchAccumulatedIncrement(universe, world, faction, researchThisTurn);
	}
}
