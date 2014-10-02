// Transition
function Transition(sourceMediaState, bsEvent, targetMediaState, sourceMediaStateName, targetMediaStateName) {
    this.sourceMediaState = sourceMediaState;
    this.bsEvent = bsEvent.Clone();
    this.targetMediaState = targetMediaState;
    this.sourceMediaStateName = sourceMediaStateName;
    this.targetMediaStateName = targetMediaStateName;
}

Transition.prototype.toJSON = function () {
    return { "sourceMediaState": this.sourceMediaState.name, "bsEvent": this.bsEvent.name, "targetMediaState": this.targetMediaState.name };
}
