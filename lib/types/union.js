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
var factories_1 = require("../core/factories");
var utils_1 = require("../utils");
var types_1 = require("../core/types");
var Union = (function (_super) {
    __extends(Union, _super);
    function Union(name, types, dispatcher) {
        var _this = _super.call(this, name) || this;
        _this.dispatcher = null;
        _this.dispatcher = dispatcher;
        _this.types = types;
        return _this;
    }
    Union.prototype.describe = function () {
        return "(" + this.types.map(function (factory) { return factory.type.describe(); }).join(" | ") + ")";
    };
    Union.prototype.create = function (value, environment) {
        utils_1.invariant(this.is(value), "Value " + JSON.stringify(value) + " is not assignable to union " + this.name);
        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value)(value, environment);
        }
        // find the most accomodating type
        var applicableTypes = this.types.filter(function (type) { return type.is(value); });
        if (applicableTypes.length > 1)
            return utils_1.fail("Ambiguos snapshot " + JSON.stringify(value) + " for union " + this.name + ". Please provide a dispatch in the union declaration.");
        return applicableTypes[0](value);
    };
    Union.prototype.is = function (value) {
        return this.types.some(function (type) { return type.is(value); });
    };
    return Union;
}(types_1.Type));
exports.Union = Union;
function createUnionFactory(dispatchOrType) {
    var otherTypes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        otherTypes[_i - 1] = arguments[_i];
    }
    var dispatcher = factories_1.isFactory(dispatchOrType) ? null : dispatchOrType;
    var types = factories_1.isFactory(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes;
    var name = types.map(function (type) { return type.factoryName; }).join(" | ");
    return new Union(name, types, dispatcher).factory;
}
exports.createUnionFactory = createUnionFactory;
//# sourceMappingURL=union.js.map