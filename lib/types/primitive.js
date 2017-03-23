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
var PrimitiveType = (function (_super) {
    __extends(PrimitiveType, _super);
    function PrimitiveType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrimitiveType.prototype.describe = function () {
        return "primitive";
    };
    PrimitiveType.prototype.create = function (value) {
        utils_1.invariant(utils_1.isPrimitive(value), "Not a primitive: '" + value + "'");
        return value;
    };
    PrimitiveType.prototype.is = function (thing) {
        return utils_1.isPrimitive(thing);
    };
    return PrimitiveType;
}(types_1.Type));
exports.PrimitiveType = PrimitiveType;
exports.primitiveFactory = new PrimitiveType("primitive").factory;
// TODO:
// export const String = primitiveFactory.subType("String", t => typeof t === "string") 
//# sourceMappingURL=primitive.js.map