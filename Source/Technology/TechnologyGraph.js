"use strict";
class TechnologyGraph {
    constructor(name, technologies) {
        this.name = name;
        this.technologies = technologies;
        this.technologiesByName =
            ArrayHelper.addLookupsByName(this.technologies);
    }
    static demo() {
        var techNameUnattainable = "[unattainable]";
        var returnValue = new TechnologyGraph("All Technologies", 
        // technologies
        [
            new Technology("Default", 0, // research
            [], // prerequisites
            [
                "Factory", "Laboratory", "Plantation",
            ]),
            new Technology("Biology, Basic", 50, ["Default"], ["Colonizer Hub"]),
            new Technology("Drives, Basic", 50, ["Default"], ["Ship Drive, Basic"]),
            new Technology("Generators, Basic", 50, ["Default"], ["Ship Generator, Basic"]),
            new Technology("Sensors, Basic", 50, ["Default"], ["Ship Sensors, Basic"]),
            new Technology("Shields, Basic", 50, ["Default"], ["Ship Shield, Basic"]),
            new Technology("Space Structures, Basic", 50, ["Default"], ["Shipyard", "Ship Hull, Small"]),
            new Technology("Weapons, Basic", 50, ["Default"], ["Ship Weapon, Basic"]),
            new Technology("Biology, Intermediate", 400, ["Biology, Basic"], ["Plantation, Advanced"]),
            new Technology("Drives, Intermediate", 400, ["Drives, Basic"], ["Ship Drive, Intermediate"]),
            new Technology("Generators, Intermediate", 400, ["Space Structures, Basic", "Generators, Basic"], ["Ship Generator, Intermediate"]),
            new Technology("Industry, Intermediate", 400, ["Generators, Basic"], ["Factory, Advanced"]),
            new Technology("Research, Intermediate", 400, ["Biology, Basic"], ["Laboratory, Advanced"]),
            new Technology("Sensors, Intermediate", 400, ["Sensors, Basic"], ["Ship Sensors, Intermediate"]),
            new Technology("Shields, Intermediate", 400, ["Space Structures, Basic", "Shields, Basic"], ["Orbital Shield, Basic", "Ship Shield, Intermediate", "Surface Shield, Basic"]),
            new Technology("Space Structures, Intermediate", 400, ["Space Structures, Basic"], ["Orbital Docks", "Ship Hull, Medium"]),
            new Technology("Weapons, Intermediate", 400, ["Space Structures, Basic", "Weapons, Basic"], ["Drop Ship", "Orbital Weapon, Basic", "Ship Weapon, Intermediate"]),
            new Technology("Weapons, Nonlethal", 400, ["Space Structures, Basic", "Weapons, Basic"], ["Orbital Disrupter", "Ship Disrupter"]),
            new Technology("Diplomatics, Advanced", 3200, ["Biology, Intermediate"], ["Planetwide Diplomacy Focus"]),
            new Technology("Drives, Advanced", 3200, ["Drives, Intermediate"], ["Ship Drive, Advanced"]),
            new Technology("Generators, Advanced", 3200, ["Generators, Intermediate", "Industry, Intermediate"], ["Ship Generator, Advanced"]),
            new Technology("Research, Advanced", 3200, ["Research, Intermediate"], ["Research Internetwork"]),
            new Technology("Sensors, Advanced", 3200, ["Sensors, Intermediate"], ["Ship Sensors, Intermediate"]),
            new Technology("Shields, Advanced", 3200, ["Shields, Intermediate"], ["Ship Shield, Advanced"]),
            new Technology("Shields, Cloaking", 3200, ["Shields, Intermediate"], ["Orbital Cloak", "Ship Cloak", "Surface Cloak"]),
            new Technology("Space Structures, Advanced", 3200, ["Space Structures, Intermediate"], ["Ship Hull, Medium"]),
            new Technology("Weapons, Advanced", 3200, ["Weapons, Intermediate", "Weapons, Nonlethal"], ["Ship Weapon, Advanced"]),
            new Technology("Drives, Supreme", 12800, ["Drives, Advanced"], ["Ship Drive, Supreme"]),
            new Technology("Generators, Supreme", 12800, ["Generators, Advanced"], ["Ship Generator, Supreme"]),
            new Technology("Research, Supreme", 12800, ["Generators, Advanced"], ["Planetwide Research Focus"]),
            new Technology("Sensors, Supreme", 12800, ["Sensors, Advanced"], ["Ship Sensors, Supreme"]),
            new Technology("Shields, Supreme", 12800, ["Shields, Advanced"], ["Ship Shield, Supreme"]),
            new Technology("Space Structures, Supreme", 12800, ["Space Structures, Advanced"], ["Ship Hull, Medium"]),
            new Technology("Weapons, Supreme", 12800, ["Weapons, Advanced"], ["Ship Weapon, Supreme"]),
            // todo
            new Technology("Teleportation", 99999, [techNameUnattainable], ["todo"]),
        ]);
        return returnValue;
    }
    technologiesFree() {
        var returnValues = this.technologies.filter(x => x.namesOfPrerequisiteTechnologies.length == 0
            && x.researchRequired == 0);
        return returnValues;
    }
    technologyByName(technologyName) {
        return this.technologiesByName.get(technologyName);
    }
}
