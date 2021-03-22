"use strict";
class TechnologyTree {
    constructor(name, technologies) {
        this.name = name;
        this.technologies = technologies;
        this.technologiesByName = ArrayHelper.addLookupsByName(this.technologies);
    }
    static demo() {
        var buildableNamesEmpty = new Array();
        var returnValue = new TechnologyTree("All Technologies", 
        // technologies
        [
            new Technology("A", 5, // research
            [], // prerequisites
            ["Factory", "Hub", "Laboratory", "Plantation", "Shipyard", "Ship"]),
            new Technology("A.1", 8, ["A"], buildableNamesEmpty),
            new Technology("A.2", 8, ["A"], buildableNamesEmpty),
            new Technology("A.3", 8, ["A"], buildableNamesEmpty),
            new Technology("B", 5, [], buildableNamesEmpty),
            new Technology("C", 5, [], buildableNamesEmpty),
            new Technology("A+B", 10, ["A", "B"], buildableNamesEmpty),
            new Technology("A+C", 10, ["A", "C"], buildableNamesEmpty),
            new Technology("B+C", 10, ["B", "C"], buildableNamesEmpty),
            new Technology("A+B+C", 15, ["A", "B", "C"], buildableNamesEmpty),
            new Technology("(A+B)+(B+C)", 20, ["A+B", "B+C"], buildableNamesEmpty),
        ]);
        return returnValue;
    }
    technologyByName(technologyName) {
        return this.technologiesByName.get(technologyName);
    }
}
