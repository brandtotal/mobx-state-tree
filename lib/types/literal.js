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
var utils_1 = require("../utils");
var types_1 = require("../core/types");
var Literal = (function (_super) {
    __extends(Literal, _super);
    function Literal(value) {
        var _this = _super.call(this, "" + value) || this;
        _this.value = value;
        return _this;
    }
    Literal.prototype.create = function (value) {
        utils_1.invariant(utils_1.isPrimitive(value), "Not a primitive: '" + value + "'");
        return value;
    };
    Literal.prototype.describe = function () {
        return JSON.stringify(this.value);
    };
    Literal.prototype.is = function (value) {
        return value === this.value && utils_1.isPrimitive(value);
    };
    return Literal;
}(types_1.Type));
exports.Literal = Literal;
function createLiteralFactory(value) {
    utils_1.invariant(utils_1.isPrimitive(value), "Literal types can be built only on top of primitives");
    return new Literal(value).factory;
}
exports.createLiteralFactory = createLiteralFactory;
//# sourceMappingURL=literal.js.map