var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Editor;
(function (Editor) {
    Editor[Editor["MARVEL"] = 0] = "MARVEL";
    Editor[Editor["DC"] = 1] = "DC";
})(Editor || (Editor = {}));
var SuperHero = (function () {
    function SuperHero(name, _editor, creationYear) {
        this.name = name;
        this._editor = _editor;
        this.creationYear = creationYear;
        this.name = name;
    }
    SuperHero.createMessage = function (hero) {
        return SuperHero.LABEL + ": " + hero.name + " " + hero._editor + " " + hero.creationYear;
    };
    return SuperHero;
}());
SuperHero.LABEL = 'Hero:';
var FlyingHero = (function (_super) {
    __extends(FlyingHero, _super);
    function FlyingHero() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlyingHero.prototype.fly = function (message) {
        console.log(message + this.creationYear);
    };
    return FlyingHero;
}(SuperHero));
var superman = new FlyingHero('Superman', Editor.DC, 1938);
superman.fly('Up, up and away!');
var batman = {
    name: 'Batman',
    creationYear: 1939
};
//# sourceMappingURL=object-oriented.js.map