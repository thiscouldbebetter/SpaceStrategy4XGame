"use strict";
class TechnologyGraph {
    constructor(name, technologies) {
        this.name = name;
        this.technologies = technologies;
        this.technologiesByName =
            ArrayHelper.addLookupsByName(this.technologies);
    }
    static demo() {
        var t = (n, r, p, buildableDefnsAllowed) => new Technology(n, r, p, buildableDefnsAllowed.map(x => x.name));
        var bds = new BuildableDefnsBasic();
        var returnValue = new TechnologyGraph("All Technologies", 
        // technologies
        [
            t("Default", 0, // research
            [], // prerequisites
            [
                bds.SurfaceFactory, bds.SurfaceLaboratory, bds.SurfacePlantation,
            ]),
            t("Biology, Basic", 50, ["Default"], [bds.ShipItemColonyBuilder]),
            t("Drives, Basic", 50, ["Default"], [bds.ShipDriveBasic]),
            t("Generators, Basic", 50, ["Default"], [bds.ShipGeneratorBasic]),
            t("Sensors, Basic", 50, ["Default"], [bds.ShipSensorsBasic]),
            t("Shields, Basic", 50, ["Default"], [bds.ShipShieldBasic]),
            t("Space Structures, Basic", 50, ["Default"], [bds.Shipyard, bds.ShipHullSmall]),
            t("Weapons, Basic", 50, ["Default"], [bds.ShipWeaponBasic]),
            t("Biology, Intermediate", 400, ["Biology, Basic"], [bds.SurfacePlantationAdvanced]),
            t("Drives, Intermediate", 400, ["Drives, Basic"], [bds.ShipDriveIntermediate]),
            t("Generators, Intermediate", 400, ["Space Structures, Basic", "Generators, Basic"], [bds.ShipGeneratorIntermediate]),
            t("Industry, Intermediate", 400, ["Generators, Basic"], [bds.SurfaceFactoryAdvanced]),
            t("Research, Intermediate", 400, ["Biology, Basic"], [bds.SurfaceLaboratoryAdvanced]),
            t("Sensors, Intermediate", 400, ["Sensors, Basic"], [bds.ShipSensorsIntermediate]),
            t("Shields, Intermediate", 400, ["Space Structures, Basic", "Shields, Basic"], [bds.OrbitalShield, bds.ShipShieldIntermediate, bds.SurfaceShield]),
            t("Space Structures, Intermediate", 400, ["Space Structures, Basic"], [bds.OrbitalDocks, bds.ShipHullMedium]),
            t("Weapons, Intermediate", 400, ["Space Structures, Basic", "Weapons, Basic"], [bds.ShipItemDropShip, bds.OrbitalWeaponBasic, bds.ShipWeaponIntermediate]),
            // t("Weapons, Nonlethal", 				400, [ "Space Structures, Basic", "Weapons, Basic" ], 				[ bds.OrbitalDisrupter, bds.ShipDisrupter ] ),
            t("Diplomatics, Advanced", 3200, ["Biology, Intermediate"], [bds.PlanetwideFocusDiplomacy]),
            t("Drives, Advanced", 3200, ["Drives, Intermediate"], [bds.ShipDriveAdvanced]),
            t("Generators, Advanced", 3200, ["Generators, Intermediate", "Industry, Intermediate"], [bds.ShipGeneratorAdvanced]),
            t("Research, Advanced", 3200, ["Research, Intermediate"], [bds.SurfaceLaboratoryMultiplier]),
            t("Sensors, Advanced", 3200, ["Sensors, Intermediate"], [bds.ShipSensorsAdvanced]),
            t("Shields, Advanced", 3200, ["Shields, Intermediate"], [bds.ShipShieldAdvanced]),
            t("Shields, Cloaking", 3200, ["Shields, Intermediate"], [bds.OrbitalCloak, bds.ShipItemCloak, bds.SurfaceCloak]),
            t("Space Structures, Advanced", 3200, ["Space Structures, Intermediate"], [bds.ShipHullMedium]),
            t("Weapons, Advanced", 3200, ["Weapons, Intermediate", "Weapons, Nonlethal"], [bds.ShipWeaponAdvanced]),
            t("Drives, Supreme", 12800, ["Drives, Advanced"], [bds.ShipDriveSupreme]),
            t("Generators, Supreme", 12800, ["Generators, Advanced"], [bds.ShipGeneratorSupreme]),
            t("Research, Supreme", 12800, ["Generators, Advanced"], [bds.PlanetwideFocusResearch]),
            t("Sensors, Supreme", 12800, ["Sensors, Advanced"], [bds.ShipSensorsSupreme]),
            t("Shields, Supreme", 12800, ["Shields, Advanced"], [bds.ShipShieldSupreme]),
            t("Space Structures, Supreme", 12800, ["Space Structures, Advanced"], [bds.ShipHullMedium]),
            t("Weapons, Supreme", 12800, ["Weapons, Advanced"], [bds.ShipWeaponSupreme]),
        ]);
        return returnValue;
    }
    static legacy() {
        // Technologies from the game _Ascendancy_.
        var t = (n, p, r, a) => new Technology(n, r, p, a); // Note different orders.
        var returnValue = new TechnologyGraph("All Technologies", 
        // technologies
        [
            t("Orbital Structures", [], 50, ["Shipyard", "Orbital Shield"]),
            t("Interplanetary Exploration", ["Orbital Structures"], 50, ["Small Ship Hull", "Medium Ship Hull", "Proton Shaver"]),
            t("Tonklin Diary", [], 50, ["Tonklin Motor", "Tonklin Frequency Analyzer"]),
            t("Xenobiology", [], 90, ["Xeno Archaeological Dig"]),
            t("Environmental Encapsulation", ["Xenobiology"], 50, ["Colony Base", "Ion Wrap", "Colonizer"]),
            t("Spectral Analysis", ["Tonklin Diary"], 120, ["Fourier Missiles"]),
            t("Superconductivity", ["Tonklin Diary"], 100, ["Surface Shield", "Mass Barrage Gun"]),
            t("Spacetime Surfing", ["Tonklin Diary", "Interplantary Exploration"], 90, ["Star Lane Drive"]),
            t("Advanced Chemistry", ["Environmental Encapsulation"], 100, ["Artificial Hypdroponifer", "Ion Banger"]),
            t("Advanced Interferometry", ["Spectral Analysis"], 90, ["Subspace Phase Array", "Invasion Module"]),
            t("Cloaking", ["Advanced Interferometry"], 1800, ["Surface Cloaker", "Orbital Cloaker", "Cloaker"]),
            t("Power Conversion", ["Spacetime Surfing"], 100, ["Orbital Missile Base", "Subatomic Scoop"]),
            t("Gravity Control", ["Spacetime Surfing"], 560, ["Quantum Singularity Launcher"]),
            t("Hyperlogic", ["Advanced Interferometry", "Xenobiology"], 1120, ["Research Campus", "Intellect Scrambler", "X-Ray Megaglasses"]),
            t("Momentum Deconservation", ["Spacetime Surfing"], 280, ["Concussion Shield"]),
            t("Diplomatics", ["Hyperlogic"], 2000, ["Observation Installation", "Alien Hospitality"]),
            t("Molecular Explosives", ["Spectral Analysis", "Power Conversion"], 720, ["Phase Bomb", "Mass Condensor"]),
            t("Strong Force Weakening", ["Power Conversion"], 980, ["Molecular Disassociator"]),
            t("Level Logic", ["Hyperlogic"], 3300, ["Scientist Takeover"]),
            t("Light Bending", ["Gravity Control"], 2560, ["Wave Scatterer", "Replenisher"]),
            t("Gravimetrics", ["Gravity Control"], 1320, ["Orbital Docks", "Molecular Tie Down"]),
            t("EM Field Coupling", ["Light Bending"], 4200, ["Electromagnetic Pulser", "Aural Cloud Constrictor"]),
            t("Mass Phasing", ["Gravimetrics"], 2200, ["Gravimetric Catapult"]),
            t("Thought Analysis", ["Level Logic"], 7700, ["Engineering Retreat"]),
            t("Advanced Fun Techniques", ["Diplomatics"], 5580, ["Logic Factory", "Endless Party"]),
            t("Positron Guidance", ["Molecular Explosives"], 2400, ["Industrial Megafacility", "Positron Bouncer"]),
            t("Subatomics", ["Positron Guidance"], 3300, ["Hyperpower Plant", "Quark Express"]),
            t("Advanced Exploration", ["Mass Phasing, Hyperlogic"], 4140, ["Star Lane Hyperdrive", "Large Ship Hull"]),
            t("Gravimetric Combustion", ["Gravimetrics", "Positron Guidance"], 2600, ["Graviton Projector", "Toroidal Blaster"]),
            t("Plasmatics", ["Subatomics"], 5700, ["Plasmatron", "Plasma Coupler"]),
            t("Planetary Replenishment", ["Gravimetric Combustion", "Environmental Encapsulation"], 2560, ["Habitat", "Terraforming"]),
            t("Momentum Reflection", ["Subatomics, Momentum Deconservation"], 4420, ["Gravity Distorter"]),
            t("Large Scale Construction", ["Gravimetric Combustion", "Advanced Exploration"], 4200, ["Metroplex", "Gigantic Ship Hull"]),
            t("Hyperradiation", ["Momentum Reflection", "EM Field Coupling"], 5040, ["Hyperwave Tympanum", "Van Creeg Hypersplicer"]),
            t("Superstring Compression", ["Plasmatics"], 3640, ["Hyperfuel"]),
            t("Muratroyd Hypothesis", ["Superstring Compression", "Level Logic"], 5940, ["Short Range Orbital Whopper", "Murgatroyd's Knower", "Gyro-Inductor"]),
            t("Energy Redirection", ["Hyperradiation"], 4400, ["Deactotron, Recaller", "Sacrificial Orb"]),
            t("Stasis Field Science", ["Hyperradiation"], 3600, ["Tractor Beam", "Brunswik Dissipator", "Planetary Tractor Beam"]),
            t("Matter Duplication", ["Superstring Compression", "Momentum Reflection"], 5040, ["Cloning Plant", "Disarmer"]),
            t("Scientific Sorcery", ["Mergatroyd Hypothesis"], 5400, ["Smart Bomb", "Containment Device"]),
            t("Starlane Anatomy", ["Energy Redirection", "Plasmatics"], 3450, ["Lane Blocker", "Lane Destabilizer"]),
            t("Coherent Photonics", ["Energy Redirection"], 7000, ["Ueberlaser", "Cannibalizer"]),
            t("Microbotics", ["Matter Duplication"], 9020, ["Automation"]),
            t("Energy Focusing", ["Coherent Photonics", "Muratroyd Hypothesis"], 5220, ["Myrmidonic Carbonizer", "Accutron"]),
            t("Inertial Control", ["Starlane Anatomy", "Matter Duplication"], 10080, ["Inertia Negator"]),
            t("Advanced Planetary Armaments", ["Coherent Photonics", "Large Scale Construction"], 12240, ["Surface Mega Shield", "Long Range Orbital Whopper"]),
            t("Fergnatz's Last Theorem", ["Scientific Sorcery"], 10880, ["Fergnatz Lens", "Gizmogrifier"]),
            t("Hypergeometry", ["Fergnatz's Last Theorem"], 12920, ["Hypersphere Driver", "Hyperswapper"]),
            t("Repulsion Beam Tech", ["Energy Focusing"], 7040, ["Fleet Disperser"]),
            t("Hyperwave Technology", ["Energy Focusing", "Hyperradiation"], 7260, ["Orbital Mega Shield", "Hyperwave Nullifier"]),
            t("Megagraph Theory", ["Fergnatz's Last Theorem"], 11760, ["Internet"]),
            t("Nanoenergons", ["Fergnatz's Last Theorem", "Hyperwave Technology"], 12580, ["Nanowave Decoupling Net", "Nanotwirler"]),
            t("Ecosphere Phase Control", ["Hypergeometry", "Planetary Replenishment"], 9240, ["Fertilization Plant"]),
            t("Teleinfiltration", ["Hyperwave Technology", "Thought Analysis"], 8580, ["Shield Blaster", "Specialty Blaster"]),
            t("Hyperwave Emission Control", ["Hyperwave Technology"], 9460, ["Backfirer"]),
            t("Hyperdrive Technology", ["Starlane Anatomy", "Teleinfiltration"], 8800, ["Lane Magnetron"]),
            t("Action At A Distance", ["Teleinfiltration", "Megagraph Theory"], 12960, ["Moving Part Exploiter"]),
            t("Doom Mechanization", ["Teleinfiltration", "Hyperwave Emission Control"], 37600, ["Disintegrator", "Self-Destructotron"]),
            t("Nanofocusing", ["Nanoenergons"], 22080, ["Nanomanipulator"]),
            t("Snooping", ["Thought Analysis", "Hyperwave Emmision Control"], 11520, ["Lane Endoscope"]),
            t("Self Modifying Structures", ["Nanofocusing", "Microbotics"], 12000, ["Remote Repair Facility"]),
            t("Nanopropulsion", ["Nanoenergons", "Hyperdrive Technology"], 17600, ["Nanowave Space Bender"]),
            t("Nanodeflection", ["Nanofocusing", "Inertia Control"], 21600, ["Nanoshell"]),
            t("Accel Energy Replenishment", ["Megagraph Theory", "Nanopropulsion"], 12480, ["Lush Growth Bomb"]),
            t("Gravity Flow Control", ["Nanopropulsion"], 12720, ["Gravimetric Condensor"]),
            t("Illusory Machinations", ["Accel. Energy Replenishment", "Nanofocusing"], 33000, ["Invulnerablizer"])
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
