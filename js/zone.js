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
