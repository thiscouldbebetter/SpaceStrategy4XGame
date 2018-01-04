
function TechnologyTree(name, technologies)
{
	this.name = name;
	this.technologies = technologies.addLookups("name");
}

{
	TechnologyTree.demo = function()
	{
		var returnValue = new TechnologyTree
		(
			"All Technologies",
			// technologies
			[
				new Technology
				(
					"A", 
					5, // research
					[], // prerequisites
					[ "Factory", "Hub", "Laboratory", "Plantation", "Shipyard", "Ship" ]
				),
				new Technology("A.1", 	8, ["A"]),
				new Technology("A.2", 	8, ["A"]),
				new Technology("A.3", 	8, ["A"]),
				new Technology("B", 	5, []),
				new Technology("C", 	5, []),

				new Technology("A+B", 	10, ["A", "B"]),
				new Technology("A+C", 	10, ["A", "C"]),
				new Technology("B+C", 	10, ["B", "C"]),

				new Technology("A+B+C", 15, ["A", "B", "C"]),

				new Technology("(A+B)+(B+C)", 	20, ["A+B", "B+C"]),
			]
		);

		return returnValue;
	}
}
