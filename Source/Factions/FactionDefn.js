"use strict";
class FactionDefn {
    constructor(name, planetStartingTypeName, ability, visual, canBuildOnBarrenTerrain, ignoresPlanetarySurfaceShields, shipHullIntegrityMultiplier, starlaneTravelSpeedMultiplier) {
        this.name = name;
        this.planetStartingTypeName = planetStartingTypeName;
        this.ability = ability;
        this.visual = visual;
        this.canBuildOnBarrenTerrain = canBuildOnBarrenTerrain || false;
        this.ignoresPlanetarySurfaceShields = ignoresPlanetarySurfaceShields || false;
        this.shipHullIntegrityMultiplier = shipHullIntegrityMultiplier || 1;
        this.starlaneTravelSpeedMultiplier = starlaneTravelSpeedMultiplier || 1;
    }
    static Instances() {
        if (FactionDefn._instances == null) {
            FactionDefn._instances = new FactionDefn_Instances();
        }
        return FactionDefn._instances;
    }
    static byName(name) {
        return FactionDefn.Instances().byName(name);
    }
    canBuildOnBarrenTerrainSet() {
        this.canBuildOnBarrenTerrain = true;
        return this;
    }
    ignoresPlanetarySurfaceShieldsSet() {
        this.ignoresPlanetarySurfaceShields = true;
        return this;
    }
    shipHullIntegrityMultiplierSet(value) {
        this.shipHullIntegrityMultiplier = value;
        return this;
    }
    starlaneTravelSpeedMultiplierSet(value) {
        this.starlaneTravelSpeedMultiplier = value;
        return this;
    }
}
class FactionDefn_Instances {
    constructor() {
        var fas = FactionAbility.Instances();
        var pss = PlanetSize.Instances();
        var pes = PlanetEnvironment.Instances();
        var pt = (size, env) => PlanetType.byName(size.name + " " + env.name);
        var fd = (name, planetType, factionAbility, visual) => {
            return new FactionDefn(name, planetType.name(), factionAbility, visual, null, // canBuildOnBarrenTerrain
            null, // ignoresPlanetarySurfaceShields
            null, // shipHullIntegrityMultiplier
            null // starlaneTravelSpeedMultiplier
            );
        };
        var visualDefault = new VisualNone();
        this.Adaptable = fd("Adaptable", pt(pss.Large, pes.Primordial), fas.Adapt, visualDefault).canBuildOnBarrenTerrainSet();
        this.Charming = fd("Charming", pt(pss.Large, pes.Special), fas.Charm, visualDefault);
        this.Clairvoyant = fd("Clairvoyant", pt(pss.Giant, pes.Chapel), fas.Clairvoyize, visualDefault);
        this.Cramming = fd("Cramming", pt(pss.Large, pes.Tycoon), fas.Cram, visualDefault);
        this.Disruptive = fd("Disruptive", pt(pss.Large, pes.Congenial), fas.Disrupt, visualDefault);
        this.Energetic = fd("Energetic", pt(pss.Large, pes.Chapel), fas.Energize, visualDefault);
        this.Enervating = fd("Enervating", pt(pss.Large, pes.Mineral), fas.Enervate, visualDefault);
        this.Farsighted = fd("Farsighted", pt(pss.Large, pes.Cathedral), fas.Farsee, visualDefault);
        this.Hermited = fd("Hermited", pt(pss.Giant, pes.Eden), fas.Hermitize, visualDefault);
        this.Inspired = fd("Inspired", pt(pss.Large, pes.Cathedral), fas.Inspire, visualDefault);
        this.Intractable = fd("Intractable", pt(pss.Giant, pes.Special), fas.Intractablize, visualDefault);
        this.Invasive = fd("Invasive", pt(pss.Giant, pes.Supermineral), fas.Invade, visualDefault).ignoresPlanetarySurfaceShieldsSet();
        this.Larcenous = fd("Larcenous", pt(pss.Giant, pes.Cathedral), fas.Larcenize, visualDefault);
        this.Manipulative = fd("Manipulative", pt(pss.Large, pes.Supermineral), fas.Manipulate, visualDefault);
        this.Nurturing = fd("Nurturing", pt(pss.Large, pes.Cornucopia), fas.Nurture, visualDefault);
        this.Prolific = fd("Prolific", pt(pss.Giant, pes.Tycoon), fas.Prolificate, visualDefault);
        this.Regenerative = fd("Regenerative", pt(pss.Giant, pes.Congenial), fas.Regenerate, visualDefault);
        this.Speedy = fd("Speedy", pt(pss.Medium, pes.Eden), fas.Speed, visualDefault).starlaneTravelSpeedMultiplierSet(2);
        this.Telepathic = fd("Telepathic", pt(pss.Large, pes.Eden), fas.Telepathicize, visualDefault);
        this.Tough = fd("Tough", pt(pss.Giant, pes.Primordial), fas.Toughen, visualDefault).shipHullIntegrityMultiplierSet(2);
        this.Xenophobic = fd("Xenophobic", pt(pss.Giant, pes.Mineral), fas.Xenophobicize, visualDefault);
        this._All = this.all();
    }
    all() {
        var factionsAll = [
            this.Adaptable,
            this.Charming,
            this.Clairvoyant,
            this.Cramming,
            this.Disruptive,
            this.Energetic,
            this.Enervating,
            this.Farsighted,
            this.Hermited,
            this.Inspired,
            this.Intractable,
            this.Invasive,
            this.Larcenous,
            this.Manipulative,
            this.Prolific,
            this.Regenerative,
            this.Nurturing,
            this.Speedy,
            this.Telepathic,
            this.Tough,
            this.Xenophobic
        ];
        return factionsAll;
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
