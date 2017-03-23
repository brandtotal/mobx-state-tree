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
var node_1 = require("../core/node");
var utils_1 = require("../utils");
var types_1 = require("../core/types");
var DefaultValue = (function (_super) {
    __extends(DefaultValue, _super);
    function DefaultValue(type, defaultValue) {
        var _this = _super.call(this, type.type.name) || this;
        _this.type = type;
        _this.defaultValue = defaultValue;
        return _this;
    }
    DefaultValue.prototype.describe = function () {
        return "(" + this.type.type.describe() + " = " + JSON.stringify(this.defaultValue) + ")";
    };
    DefaultValue.prototype.create = function (value, environment) {
        return typeof value === "undefined" ? this.type(this.defaultValue) : this.type(value);
    };
    DefaultValue.prototype.is = function (value) {
        return this.type.is(value);
    };
    return DefaultValue;
}(types_1.Type));
exports.DefaultValue = DefaultValue;
function createDefaultValueFactory(type, defaultValueOrNode) {
    var defaultValue = node_1.hasNode(defaultValueOrNode) ? node_1.getNode(defaultValueOrNode).snapshot : defaultValueOrNode;
    utils_1.invariant(type.is(defaultValue), "Default value " + JSON.stringify(defaultValue) + " is not assignable to type " + type.factoryName + ". Expected " + JSON.stringify(type.type.describe()));
    return new DefaultValue(type, defaultValue).factory;
}
exports.createDefaultValueFactory = createDefaultValueFactory;
//# sourceMappingURL=with-default.js.map