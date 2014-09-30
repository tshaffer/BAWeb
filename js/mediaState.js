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
