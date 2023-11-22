"use strict";
class WeightedDistribution {
    constructor(items) {
        this.items = items;
        this.totalOfWeights = 0;
        this.items.forEach(x => this.totalOfWeights += x.weight);
    }
    valueRandom() {
        var returnValue;
        var randomNumber = Math.random();
        var randomNumberScaledToTotal = randomNumber * this.totalOfWeights;
        var sumOfWeightsSoFar = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            sumOfWeightsSoFar += item.weight;
            var isSelected = randomNumberScaledToTotal <= sumOfWeightsSoFar;
            if (isSelected) {
                returnValue = item.value;
                break;
            }
        }
        return returnValue;
    }
}
class Weighted {
    constructor(weight, value) {
        this.weight = weight;
        this.value = value;
    }
}
