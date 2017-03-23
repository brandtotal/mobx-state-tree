"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../core/types");
var Recursive = (function (_super) {
    __extends(Recursive, _super);
    function Recursive(name, def) {
        var _this = _super.call(this, name) || this;
        _this.type = def(_this.factory);
        return _this;
    }
    Recursive.prototype.create = function (snapshot, environment) {
        return this.type(snapshot, environment);
    };
    Recursive.prototype.is = function (thing) {
        return this.type.is(thing);
    };
    Recursive.prototype.describe = function () {
        return this.name;
    };
    return Recursive;
}(types_1.Type));
function recursive(name, def) {
    return new Recursive(name, def).factory;
}
exports.recursive = recursive;
//# sourceMappingURL=recursive.js.map