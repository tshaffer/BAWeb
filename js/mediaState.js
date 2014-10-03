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

        // delete transition from transitionsOut of source transition
        var sourceMediaState = transitionIn.sourceMediaState;
        var sourceMediaStateTransitionOutIndex = sourceMediaState.transitionsOut.indexOf(transitionIn);
        if (sourceMediaStateTransitionOutIndex >= 0) {
            sourceMediaState.transitionsOut.splice(sourceMediaStateTransitionOutIndex, 1);
        }

        delete transitionIn;
    });

    this.transitionsOut.forEach(function (transitionOut) {

        // delete transition from transitionsIn of target transition
        var targetMediaState = transitionOut.targetMediaState;
        var targetMediaStateTransitionOutIndex = targetMediaState.transitionsOut.indexOf(transitionOut);
        if (targetMediaStateTransitionOutIndex >= 0) {
            targetMediaState.transitionsOut.splice(targetMediaStateTransitionIndex, 1);
        }

        delete transitionOut;
    });

    this.transitionsIn = [];
    this.transitionsOut = [];
}
