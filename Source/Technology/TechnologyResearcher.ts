
class TechnologyResearcher
{
	_faction: Faction;
	technologyBeingResearchedName: string;
	researchAccumulated: number;
	technologiesKnownNames: string[];

	constructor
	(
		faction: Faction,
		technologyBeingResearchedName: string,
		researchAccumulated: number,
		technologiesKnownNames: string[]
	)
	{
		this._faction = faction;
		this.technologyBeingResearchedName = technologyBeingResearchedName;
		this.researchAccumulated = researchAccumulated;
		this.technologiesKnownNames = new Array<string>();
		technologiesKnownNames.forEach(x => this.technologyLearnByName(x) );
	}

	static default(): TechnologyResearcher
	{
		return new TechnologyResearcher
		(
			null, // faction
			null, // technologyBeingResearchedName
			0, // researchAccumulated
			[], // technologiesKnownNames
		);
	}

	buildablesAvailable(world: WorldExtended): any[]
	{
		var returnValues = [];

		var technologiesByName = world.technologyGraph.technologiesByName;

		for (var i = 0; i < this.technologiesKnownNames.length; i++)
		{
			var technologyName = this.technologiesKnownNames[i];
			var technology = technologiesByName.get(technologyName);
			var technologyBuildables = technology.buildablesEnabled(world);
			returnValues.push(...technologyBuildables);
		}

		return returnValues;
	}

	faction(): Faction
	{
		return this._faction;
	}

	factionSet(value: Faction): void
	{
		this._faction = value;
	}

	name(): string
	{
		return this.faction().name + " Research";
	}

	notificationBuildNothingBeingResearched
	(
		universe: Universe, world: WorldExtended
	): Notification2
	{
		var technologyResearcher = this;

		var faction = this.faction();
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

			var researchToLearn = technologyBeingResearched.researchToLearn;
			if (this.researchAccumulated >= researchToLearn)
			{
				this.technologyBeingResearchedLearn();

				var technologyResearcher = this;

				var message =
					"The " + faction.name
					+ " have discovered the technology of "
					+ technologyBeingResearched.name + ".";

				var notification = new Notification2
				(
					message,
					() =>
					{
						var session = technologyResearcher.toSession(world.technologyGraph);
						var venueNext = session.toControl(universe, universe.display.sizeInPixels).toVenue();
						universe.venueTransitionTo(venueNext);
					}
				);
				faction.notificationAdd(notification);

				world.starCluster.roundAdvanceUntilNotificationDisable();
			}
		}
	}

	researchPerTurn(universe: Universe, world: WorldExtended): number
	{
		var faction = this.faction();
		var returnValue = faction.researchThisRound(universe, world);
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

		for (var i = 0; i < this.technologiesKnownNames.length; i++)
		{
			var techName = this.technologiesKnownNames[i];
			var technology = world.technologyGraph.technologyByName(techName);
			returnValues.push(technology);
		}

		return returnValues;
	}

	technologyBeingResearched(world: WorldExtended): Technology
	{
		var technologyGraph = world.technologyGraph;

		var returnValue =
			technologyGraph.technologyByName(this.technologyBeingResearchedName);

		return returnValue;
	}

	technologyBeingResearchedLearn(): TechnologyResearcher
	{
		if (this.technologyBeingResearched != null)
		{
			this.technologyLearnByName(this.technologyBeingResearchedName);
			this.technologyBeingResearchedSet(null);
		}

		return this;
	}

	technologyBeingResearchedSet(value: Technology): TechnologyResearcher
	{
		this.technologyBeingResearchedName =
			(value == null ? null : value.name);
		this.researchAccumulated = 0;
		return this;
	}

	technologyBeingResearcedSetToFirstAvailable(world: WorldExtended): Technology
	{
		var technologyToResearch =
			this.technologiesAvailableForResearch(world)[0];
		this.technologyBeingResearchedSet(technologyToResearch);
		return technologyToResearch;
	}

	technologyIsAvailableForResearch(technologyToCheck: Technology): boolean
	{
		var returnValue = false;

		var isAlreadyKnown =
			this.technologyIsKnown(technologyToCheck);


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
					this.technologiesKnownNames.indexOf(prerequisite) >= 0
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
		var isKnown = this.technologiesKnownNames.some
		(
			x => x == technologyToCheckName
		);
		return isKnown;
	}

	technologyLearnByName(technologyToLearnName: string): TechnologyResearcher
	{
		if (technologyToLearnName != null)
		{
			this.technologiesKnownNames.push
			(
				technologyToLearnName
			);
		}

		return this;
	}

	technologyLearn(technologyToLearn: Technology): TechnologyResearcher
	{
		return this.technologyLearnByName(technologyToLearn.name);
	}

	technologyResearch(technologyToResearch: Technology): void
	{
		var isAvailable = this.technologyIsAvailableForResearch
		(
			technologyToResearch
		);

		if (isAvailable)
		{
			this.technologyBeingResearchedSet(technologyToResearch);
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
