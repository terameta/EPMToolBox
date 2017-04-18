var Editor;
(function (Editor) {
    Editor[Editor["MARVEL"] = 0] = "MARVEL";
    Editor[Editor["DC"] = 1] = "DC";
})(Editor || (Editor = {}));
class SuperHero {
    constructor(name, _editor, creationYear) {
        this.name = name;
        this._editor = _editor;
        this.creationYear = creationYear;
        this.name = name;
    }
    static createMessage(hero) {
        return `${SuperHero.LABEL}: ${hero.name} ${hero._editor} ${hero.creationYear}`;
    }
}
SuperHero.LABEL = 'Hero:';
class FlyingHero extends SuperHero {
    fly(message) {
        console.log(message + this.creationYear);
    }
}
const superman = new FlyingHero('Superman', Editor.DC, 1938);
superman.fly('Up, up and away!');
const batman = {
    name: 'Batman',
    creationYear: 1939
};
//# sourceMappingURL=object-oriented.js.map