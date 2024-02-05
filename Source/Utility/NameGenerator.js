"use strict";
class NameGenerator {
    static generateName() {
        var returnValue = "";
        var numberOfSyllablesMin = 2;
        var numberOfSyllablesMax = 3;
        var numberOfSyllablesRange = numberOfSyllablesMax - numberOfSyllablesMin;
        var numberOfSyllables = numberOfSyllablesMin
            + Math.floor(Math.random() * numberOfSyllablesRange);
        var consonants = "bdfghjklmnprstvwxyz";
        var vowels = "aeiou";
        for (var s = 0; s < numberOfSyllables; s++) {
            var syllable = consonants[Math.floor(Math.random() * consonants.length)]
                + vowels[Math.floor(Math.random() * vowels.length)]
                + consonants[Math.floor(Math.random() * consonants.length)];
            returnValue += syllable;
        }
        returnValue = returnValue[0].toUpperCase() + returnValue.substr(1);
        return returnValue;
    }
}
