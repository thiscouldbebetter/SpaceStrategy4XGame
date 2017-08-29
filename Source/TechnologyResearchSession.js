
function TechnologyResearchSession(technologyTree, researcher)
{
	this.technologyTree = technologyTree;
	this.researcher = researcher;
}

{
	// static methods

	TechnologyResearchSession.buildExample = function()
	{
		var technologies =
		[
			new Technology("A", 		5, 	[], 			[]),
			new Technology("A.1", 		8, 	["A"], 			[]),
			new Technology("A.2", 		8, 	["A"], 			[]),
			new Technology("A.3", 		8, 	["A"], 			[]),
			new Technology("B", 		5, 	[], 			[]),
			new Technology("C", 		5, 	[], 			[]),

			new Technology("A+B", 		10, 	["A", "B"], 		[]),
			new Technology("A+C", 		10, 	["A", "C"], 		[]),
			new Technology("B+C", 		10, 	["B", "C"], 		[]),

			new Technology("A+B+C", 	15, 	["A", "B", "C"], 	[]),
	
			new Technology("(A+B)+(B+C)", 	20, 	["A+B", "B+C"], 	[]),
		];

		var technologyTree = new TechnologyTree
		(
			"All Technologies",
			technologies
		);

		var researcher = new TechnologyResearcher
		(
			"Researcher0",
			null, // nameOfTechnologyBeingResearched,
			0, // researchAccumulated
			// namesOfTechnologiesKnown
			[
				"A",
			]
		);

		var researchSession = new TechnologyResearchSession
		(
			technologyTree,
			researcher
		);

		return researchSession;
	}

	// instance methods
	
	TechnologyResearchSession.prototype.isResearchNotInProgress = function()
	{
		var returnValue = (this.researcher.researchAccumulated == 0);
		return returnValue;
	}

	TechnologyResearchSession.prototype.isTechnologyBeingResearched = function()
	{
		return (this.researcher.nameOfTechnologyBeingResearched != null);
	}

	TechnologyResearchSession.prototype.researchAccumulatedIncrement = function
	(
		amountToIncrement
	)
	{
		this.researcher.researchAccumulatedIncrement();
	}
	
	TechnologyResearchSession.prototype.researchRequired = function()
	{
		var technologyBeingResearched = this.technologyBeingResearched();
		var returnValue = 
		(
			technologyBeingResearched == null 
			? 0 
			: technologyBeingResearched.researchRequired
		);
		return returnValue;
	}

	TechnologyResearchSession.prototype.technologyBeingResearched = function()
	{
		var techName = this.researcher.nameOfTechnologyBeingResearched;
		var returnValue = this.technologyTree.technologies[techName];

		return returnValue;
	}

	// controls

	TechnologyResearchSession.prototype.controlBuild = function(size)
	{
		var margin = 10;

		var returnValue = new ControlContainer
		(
			"containerResearchSession", // name, 
			new Coords(0, 0), // pos, 
			size, 
			// children
			[
				new ControlLabel
				(
					"labelResearcher", // name, 
					new Coords(margin, margin), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding("Researcher:") //text
				),

				new ControlLabel
				(
					"textResearcher", // name, 
					new Coords(70, margin), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding(this.researcher.name) //text
				),

				new ControlLabel
				(
					"labelTechnologiesKnown", // name, 
					new Coords(margin, 30), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding("Technologies Known:") //text
				),

				new ControlSelect
				(
					"listTechnologiesKnown",
					new Coords(margin, 45), // pos
					new Coords(110, 50), // size
					null, // dataBindingForValueSelected
					// options
					new DataBinding
					(
						this.researcher.namesOfTechnologiesKnown,
						null
					),
					null, // optionvalues,
					null, // optionText,
					new DataBinding(true), // isEnabled
					4 // itemsVisible
				),

				new ControlLabel
				(
					"labelTechnologiesAvailable", // name, 
					new Coords(140, 30), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding("Technologies Available:") // text
				),

				new ControlSelect
				(
					"listTechnologiesAvailable", // name, 
					new Coords(140, 45), // pos, 
					new Coords(110, 50), // size, 
					// valueSelected,
					new DataBinding
					(
						this.researcher, 
						"nameOfTechnologyBeingResearched"
					),
					// options,
					new DataBinding
					(
						this.researcher, "technologiesAvailable" 
					),
					"name", // bindingExpressionForOptionValues,
					"name", // bindingExpressionForOptionText
					//true, // isEnabled
					new DataBinding(this, "isResearchNotInProgress"),
					4 // numberOfItemsVisible
				),
			
				new ControlLabel
				(
					"labelTechnologyBeingResearched", // name, 
					new Coords(margin, 120), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding("Technology Being Researched:") // text
				),

				new ControlLabel
				(
					"textTechnologyBeingResearched", // name, 
					new Coords(160, 120), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding
					(
						this.researcher, 
						"nameOfTechnologyBeingResearched"
					)
				),

				new ControlLabel
				(
					"labelResearchAccumulated", // name, 
					new Coords(10, 135), // pos, 
					new Coords(10, 10), // size, 
					false, // isTextCentered, 
					new DataBinding("Research Accumulated:") // text
				),

				new ControlLabel
				(
					"textResearchAccumulated", // name, 
					new Coords(120, 135), // pos, 
					new Coords(30, 10), // size, 
					true, // isTextCentered, 
					new DataBinding(this.researcher, "researchAccumulated") // text
				),

				new ControlLabel
				(
					"labelSlash", // name, 
					new Coords(130, 135), // pos, 
					new Coords(30, 10), // size, 
					true, // isTextCentered, 
					new DataBinding("/") // text
				),

				new ControlLabel
				(
					"textResearchRequired", // name, 
					new Coords(140, 135), // pos, 
					new Coords(30, 10), // size, 
					true, // isTextCentered, 
					new DataBinding(this, "researchRequired") // text
				),

				new ControlButton
				(
					"buttonResearchPlusOne", //name, 
					new Coords(10, 155), //pos, 
					new Coords(100, 25), // size, 
					"Research + 1", // text, 
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					// click
					function() 
					{ 
						var universe = Globals.Instance.universe;
						var session = universe.venueCurrent.researchSession;
						session.researchAccumulatedIncrement(1);
					}
				)
			]
		);

		this.control = returnValue;

		return returnValue;
	}
}
