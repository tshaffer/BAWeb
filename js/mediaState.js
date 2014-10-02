function MediaState(name, playlistItem, x, y) {
    this.name = name;
    this.playlistItem = playlistItem;
    this.x = x;
    this.y = y;

    this.transitionsIn = new Array();
    this.transitionsOut = new Array();
}

MediaState.prototype.AddTransitionIn = function (transition) {
    this.transitionsIn.push(transition);
}

MediaState.prototype.AddTransitionOut = function (transition) {
    this.transitionsOut.push(transition);
}

MediaState.prototype.GetCurrentPosition = function () {
    return this.thumb.GetCurrentPosition();
}

MediaState.prototype.SetCurrentPosition = function (pos) {
    this.x = pos.x;
    this.y = pos.y;
}

MediaState.prototype.DeleteTransitions = function () {

    var mediaState = this;

    this.transitionsIn.forEach(function (transitionIn) {
        //debugger;

        // delete transition from transitionsOut of source transition
        var sourceMediaState = transitionIn.sourceMediaState;

        // TODO find corresponding transition - method is not foolproof - need some kind of unique id to match transition
        sourceMediaState.transitionsOut.forEach(function (sourceMediaStateTransitionOut) {
            // TODO might there be transitions that have no target?
            // TODO - targetMediaStateName was(is) undefined
            //if (sourceMediaStateTransitionOut.targetMediaStateName == mediaState.name) {
            if (sourceMediaStateTransitionOut.targetMediaState.name == mediaState.name) {
                sourceMediaState.transitionsOut.splice(sourceMediaState.transitionsOut.indexOf(sourceMediaStateTransitionOut), 1);
                delete sourceMediaStateTransitionOut;
            }
        });
        delete transitionIn;
    });

    this.transitionsOut.forEach(function (transitionOut) {

        // delete transition from transitionsIn of target transition
        var targetMediaState = transitionOut.targetMediaState;

        // TODO find corresponding transition - method is not foolproof - need some kind of unique id to match transition
        targetMediaState.transitionsIn.forEach(function (targetMediaStateTransitionIn) {
            // TODO might there be transitions that have no target?
            // TODO - targetMediaStateName was(is) undefined
            //if (targetMediaStateTransitionOut.targetMediaStateName == mediaState.name) {
            if (targetMediaStateTransitionIn.targetMediaState.name == mediaState.name) {
                targetMediaState.transitionsIn.splice(targetMediaState.transitionsIn.indexOf(targetMediaStateTransitionIn), 1);
                delete targetMediaStateTransitionIn;
            }
        });

        delete transitionOut;
    });

    this.transitionsIn = [];
    this.transitionsOut = [];
}
