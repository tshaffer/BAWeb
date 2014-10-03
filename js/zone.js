function Zone(name, x, y, width, height) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mediaStates = [];
}


Zone.prototype.GetMediaStates = function () {
    return this.mediaStates;
}

Zone.prototype.DeleteMediaState = function (mediaState) {

    mediaState.DeleteTransitions();

    this.mediaStates.splice(this.mediaStates.indexOf(mediaState), 1);
    delete mediaState;
}

Zone.prototype.DeleteTransition = function (transition) {

    // find the media states that reference this transition
    this.mediaStates.forEach(function (mediaState) {
        var transitionIndex = mediaState.transitionsIn.indexOf(transition);
        if (transitionIndex >= 0) {
            mediaState.transitionsIn.splice(transitionIndex, 1);
        }
        transitionIndex = mediaState.transitionsOut.indexOf(transition);
        if (transitionIndex >= 0) {
            mediaState.transitionsOut.splice(transitionIndex, 1);
        }
    });

    delete transition;
}
