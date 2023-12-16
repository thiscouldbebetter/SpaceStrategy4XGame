"use strict";
class Technology {
    constructor(name, researchToLearn, namesOfPrerequisiteTechnologies, namesOfBuildablesEnabled) {
        this.name = name;
        this.researchToLearn = researchToLearn;
        this.namesOfPrerequisiteTechnologies = namesOfPrerequisiteTechnologies;
        this.namesOfBuildablesEnabled = namesOfBuildablesEnabled;
    }
    buildablesEnabled(world) {
        var returnValues = new Array();
        for (var i = 0; i < this.namesOfBuildablesEnabled.length; i++) {
            var buildableName = this.namesOfBuildablesEnabled[i];
            var buildableDefn = world.buildableDefnByName(buildableName);
            returnValues.push(buildableDefn);
        }
        return returnValues;
    }
    strategicValue(world) {
        var multiplier = 1; // todo
        return this.researchToLearn * multiplier;
    }
}
