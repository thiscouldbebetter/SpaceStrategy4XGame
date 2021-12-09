
class TechnologyTree
{
	name: string;
	technologies: Technology[];

	technologiesByName: Map<string,Technology>;

	constructor(name: string, technologies: Technology[])
	{
		this.name = name;
		this.technologies = technologies;
		this.technologiesByName = ArrayHelper.addLookupsByName(this.technologies);
	}

	static demo()
	{
		var returnValue = new TechnologyTree
		(
			"All Technologies",
			// technologies
			[
				new Technology
				(
					"Default",
					0, // research
					[], // prerequisites
					[
						"Factory", "Laboratory", "Plantation",
					]
				),

				new Technology("Drives", 		5, [ "Default" ], [ "Ship Drive, Basic" ] ),
				new Technology("Generators", 	5, [ "Default" ], [ "Ship Generator, Basic" ] ),
				new Technology("Hubs", 			5, [ "Default" ], [ "Colony Hub" ] ),
				new Technology("Hulls", 		5, [ "Default" ], [ "Ship Hull, Small" ] ),
				new Technology("Shields", 		5, [ "Default" ], [ "Ship Shield, Basic" ] ),
				new Technology("Weapons", 		5, [ "Default" ], [ "Ship Weapon, Basic" ] ),

				new Technology
				(
					"Shipyards",
					10,
					[
						"Drives",
						"Generators",
						"Hulls",
					],
					[ "Shipyard", "Ship" ]
				),
			]
		);

		return returnValue;
	}

	technologiesFree(): Technology[]
	{
		var returnValues = this.technologies.filter
		(
			x =>
				x.namesOfPrerequisiteTechnologies.length == 0
				&& x.researchRequired == 0 
		);
		return returnValues;
	}

	technologyByName(technologyName: string)
	{
		return this.technologiesByName.get(technologyName);
	}
}
