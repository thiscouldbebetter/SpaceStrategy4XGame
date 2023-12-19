"use strict";
class FactionNames {
    static Instance() {
        if (FactionNames._instance == null) {
            FactionNames._instance = new FactionNames();
        }
        return FactionNames._instance;
    }
    constructor() {
        this._All =
            this.namesAlternate();
        //this.namesDescriptive();
        //this.namesLegacy();
    }
    namesAlternate() {
        var returnValues = [
            "Astril",
            "Bulvan",
            "Drex",
            "Eldor",
            "Fulbi",
            "Grast",
            "Hemmeran",
            "Ildun",
            "Jarrae",
            "Kwarg",
            "Laretta",
            "Mooldug",
            "Opretti",
            "Panquel",
            "Restrin",
            "Sivulan",
            "Trontar",
            "Ullex",
            "Wolto",
            "Yan",
            "Zonnet"
        ];
        return returnValues;
    }
    namesDescriptive() {
        var returnValues = [
            "Adaptable",
            "Charming",
            "Clairvoyant",
            "Cramming",
            "Disruptive",
            "Energetic",
            "Enervating",
            "Farsighted",
            "Hermited",
            "Inspired",
            "Intractable",
            "Invasive",
            "Larcenous",
            "Manipulative",
            "Nurturing",
            "Prolific",
            "Regenerative",
            "Speedy",
            "Telepathic",
            "Tough",
            "Xenophobic"
        ];
        return returnValues;
    }
    namesLegacy() {
        var returnValues = [
            "Orfa",
            "Baliflids",
            "Kambuchka",
            "Nimbuloids",
            "Ungooma",
            "Swaparamans",
            "Shevar",
            "Oculons",
            "Arbryls",
            "Chamachies",
            "Capelons",
            "Minions",
            "Dubtaks",
            "Marmosians",
            "Govorom",
            "Mebes",
            "Fludentri",
            "Chronomyst",
            "Hanshaks",
            "Snovedomas",
            "Frutmaka"
        ];
        return returnValues;
    }
}
