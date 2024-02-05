"use strict";
class BuildableEffect {
    constructor(name, orderToApplyIn, apply) {
        this.name = name;
        this.orderToApplyIn = orderToApplyIn;
        this._apply = apply;
    }
    static Instances() {
        if (BuildableEffect._instances == null) {
            BuildableEffect._instances = new BuildableEffect_Instances();
        }
        return BuildableEffect._instances;
    }
    static applyManyInOrder(effects, uwpe) {
        var orders = new Array();
        var effectArraysByOrder = new Map();
        effects.forEach(effect => {
            var order = effect.orderToApplyIn;
            if (effectArraysByOrder.has(order) == false) {
                orders.push(order);
                effectArraysByOrder.set(order, []);
            }
            var effectsWithSameOrder = effectArraysByOrder.get(order);
            effectsWithSameOrder.push(effect);
        });
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            var effects = effectArraysByOrder.get(order);
            for (var e = 0; e < effects.length; e++) {
                var effect = effects[e];
                effect.apply(uwpe);
            }
        }
    }
    apply(uwpe) {
        this._apply(uwpe);
    }
}
class BuildableEffect_Instances {
    constructor() {
        this.None = new BuildableEffect("None", 0, (uwpe) => { });
        this.ThrowError = new BuildableEffect("Throw Error", 0, (uwpe) => { throw new Error(BuildableEffect.name); });
    }
}
