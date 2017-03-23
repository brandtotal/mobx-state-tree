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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var node_1 = require("../core/node");
var factories_1 = require("../core/factories");
var utils_1 = require("../utils");
var types_1 = require("../core/types");
var ArrayType = (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, subType) {
        var _this = _super.call(this, name) || this;
        _this.isArrayFactory = true;
        _this.subType = subType;
        return _this;
    }
    ArrayType.prototype.describe = function () {
        return this.subType.type.describe() + "[]";
    };
    ArrayType.prototype.createNewInstance = function () {
        return mobx_1.observable.shallowArray();
    };
    ArrayType.prototype.finalizeNewInstance = function (instance) {
    };
    ArrayType.prototype.getChildNodes = function (_, target) {
        var res = [];
        target.forEach(function (value, index) {
            node_1.maybeNode(value, function (node) { res.push(["" + index, node]); });
        });
        return res;
    };
    ArrayType.prototype.getChildNode = function (node, target, key) {
        if (parseInt(key) < target.length)
            return node_1.maybeNode(target[key], utils_1.identity, utils_1.nothing);
        return null;
    };
    ArrayType.prototype.willChange = function (node, change) {
        switch (change.type) {
            case "update":
                var newValue = change.newValue;
                var oldValue = change.object[change.index];
                if (newValue === oldValue)
                    return null;
                change.newValue = node.prepareChild("" + change.index, newValue);
                break;
            case "splice":
                change.object.slice(change.index, change.removedCount).forEach(function (oldValue) {
                    node_1.maybeNode(oldValue, function (adm) { return adm.setParent(null); });
                });
                change.added = change.added.map(function (newValue, pos) {
                    return node.prepareChild("" + (change.index + pos), newValue);
                });
                break;
        }
        return change;
    };
    ArrayType.prototype.serialize = function (node, target) {
        return target.map(node_1.valueToSnapshot);
    };
    ArrayType.prototype.didChange = function (node, change) {
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: "/" + change.index,
                    value: node_1.valueToSnapshot(change.newValue)
                }, node);
            case "splice":
                for (var i = change.index + change.removedCount - 1; i >= change.index; i--)
                    node.emitPatch({
                        op: "remove",
                        path: "/" + i
                    }, node);
                for (var i = 0; i < change.addedCount; i++)
                    node.emitPatch({
                        op: "add",
                        path: "/" + (change.index + i),
                        value: node_1.valueToSnapshot(change.added[i])
                    }, node);
                return;
        }
    };
    ArrayType.prototype.applyPatchLocally = function (node, target, subpath, patch) {
        var index = subpath === "-" ? target.length : parseInt(subpath);
        switch (patch.op) {
            case "replace":
                target[index] = patch.value;
                break;
            case "add":
                target.splice(index, 0, patch.value);
                break;
            case "remove":
                target.splice(index, 1);
                break;
        }
    };
    ArrayType.prototype.applySnapshot = function (node, target, snapshot) {
        // TODO: make a smart merge here, try to reuse instances..
        target.replace(snapshot);
    };
    ArrayType.prototype.getChildFactory = function (key) {
        return this.subType;
    };
    ArrayType.prototype.isValidSnapshot = function (snapshot) {
        var _this = this;
        return Array.isArray(snapshot) && snapshot.every(function (item) { return _this.subType.is(item); });
    };
    return ArrayType;
}(types_1.ComplexType));
__decorate([
    mobx_1.action
], ArrayType.prototype, "applySnapshot", null);
exports.ArrayType = ArrayType;
function createArrayFactory(subtype) {
    return new ArrayType(subtype.factoryName + "[]", subtype).factory;
}
exports.createArrayFactory = createArrayFactory;
function isArrayFactory(factory) {
    return factories_1.isFactory(factory) && factory.type.isArrayFactory === true;
}
exports.isArrayFactory = isArrayFactory;
//# sourceMappingURL=array.js.map