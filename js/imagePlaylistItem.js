function ImagePlaylistItem(name, url) {
    PlaylistItem.call(this, name, url); //call super constructor.
}

//subclass extends superclass
ImagePlaylistItem.prototype = Object.create(PlaylistItem.prototype);
ImagePlaylistItem.prototype.constructor = ImagePlaylistItem;
