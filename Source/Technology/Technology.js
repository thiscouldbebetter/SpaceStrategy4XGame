
class Technology
{
	constructor
	(
		name,
		researchRequired,
		namesOfPrerequisiteTechnologies,
		namesOfBuildablesEnabled
	)
	{
		this.name = name;
		this.researchRequired = researchRequired;
		this.namesOfPrerequisiteTechnologies = namesOfPrerequisiteTechnologies;
		this.namesOfBuildablesEnabled = namesOfBuildablesEnabled;
	}

	buildablesEnabled(world)
	{
		var returnValues = [];

		for (var i = 0; i < this.namesOfBuildablesEnabled.length; i++)
		{
			var buildableName = this.namesOfBuildablesEnabled[i];
			var buildable = world.buildableByName(buildableName);
			returnValues.push(buildable);
		}

		return returnValues;
	}
}
