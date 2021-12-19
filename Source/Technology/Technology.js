"use strict";
class Technology {
    constructor(name, researchRequired, namesOfPrerequisiteTechnologies, namesOfBuildablesEnabled) {
        this.name = name;
        this.researchRequired = researchRequired;
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
        var multiplier = 0; // todo
        return this.researchRequired * multiplier;
    }
}
