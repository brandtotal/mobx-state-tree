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
var CoreType = (function (_super) {
    __extends(CoreType, _super);
    function CoreType(name, checker) {
        var _this = _super.call(this, name) || this;
        _this.checker = checker;
        return _this;
    }
    CoreType.prototype.describe = function () {
        return this.name;
    };
    CoreType.prototype.create = function (value) {
        utils_1.invariant(utils_1.isPrimitive(value), "Not a primitive: '" + value + "'");
        utils_1.invariant(this.checker(value), "Value is not assignable to '" + this.name + "'");
        return value;
    };
    CoreType.prototype.is = function (thing) {
        return utils_1.isPrimitive(thing) && this.checker(thing);
    };
    return CoreType;
}(types_1.Type));
exports.CoreType = CoreType;
// tslint:disable-next-line:variable-name
exports.string = new CoreType("string", function (v) { return typeof v === "string"; }).factory;
// tslint:disable-next-line:variable-name
exports.number = new CoreType("number", function (v) { return typeof v === "number"; }).factory;
// tslint:disable-next-line:variable-name
exports.boolean = new CoreType("boolean", function (v) { return typeof v === "boolean"; }).factory;
//# sourceMappingURL=core-types.js.map