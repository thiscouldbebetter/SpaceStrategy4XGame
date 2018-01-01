
function Technology
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
{
	Technology.prototype.buildablesEnabled = function(world)
	{
		var returnValues = [];

		for (var i = 0; i < this.namesOfBuildablesEnabled.length; i++)
		{
			var buildableName = this.namesOfBuildablesEnabled[i];
			var buildable = world.buildables[buildableName];
			returnValues.push(buildable);
		}

		return returnValues;
	}
}
