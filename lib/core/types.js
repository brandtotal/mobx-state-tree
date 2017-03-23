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
var mobx_1 = require("mobx");
var node_1 = require("./node");
var Type = (function () {
    function Type(name) {
        this.name = name;
        this.factory = this.initializeFactory();
    }
    Type.prototype.initializeFactory = function () {
        var _this = this;
        var factory = mobx_1.action(this.name, this.create.bind(this));
        factory.type = this;
        factory.isFactory = true;
        factory.factoryName = this.name;
        factory.is = function (value) { return _this.is(value); };
        return factory;
    };
    return Type;
}());
exports.Type = Type;
var ComplexType = (function (_super) {
    __extends(ComplexType, _super);
    function ComplexType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComplexType.prototype.create = function (snapshot, environment) {
        var instance = this.createNewInstance();
        var node = new node_1.Node(instance, environment, this.factory);
        this.finalizeNewInstance(instance);
        if (arguments.length > 0)
            node.applySnapshot(snapshot);
        Object.seal(instance);
        return instance;
    };
    ComplexType.prototype.is = function (value) {
        if (!value || typeof value !== "object")
            return false;
        if (node_1.hasNode(value))
            return this.isValidSnapshot(node_1.getNode(value).snapshot); // could check factory, but that doesn't check structurally...
        return this.isValidSnapshot(value);
    };
    return ComplexType;
}(Type));
exports.ComplexType = ComplexType;
//# sourceMappingURL=types.js.map