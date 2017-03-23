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
var json_patch_1 = require("../core/json-patch");
var types_1 = require("../core/types");
var MapType = (function (_super) {
    __extends(MapType, _super);
    function MapType(name, subType) {
        var _this = _super.call(this, name) || this;
        _this.isMapFactory = true;
        _this.subType = subType;
        return _this;
    }
    MapType.prototype.describe = function () {
        return "Map<string, " + this.subType.type.describe() + ">";
    };
    MapType.prototype.createNewInstance = function () {
        return mobx_1.observable.shallowMap();
    };
    MapType.prototype.finalizeNewInstance = function (instance) {
    };
    MapType.prototype.getChildNodes = function (_node, target) {
        var res = [];
        target.forEach(function (value, key) {
            node_1.maybeNode(value, function (node) { res.push([key, node]); });
        });
        return res;
    };
    MapType.prototype.getChildNode = function (node, target, key) {
        if (target.has(key))
            return node_1.maybeNode(target.get(key), utils_1.identity, utils_1.nothing);
        return null;
    };
    MapType.prototype.willChange = function (node, change) {
        switch (change.type) {
            case "update":
                {
                    var newValue = change.newValue;
                    var oldValue = change.object.get(change.name);
                    if (newValue === oldValue)
                        return null;
                    change.newValue = node.prepareChild("" + change.name, newValue);
                }
                break;
            case "add":
                {
                    var newValue = change.newValue;
                    change.newValue = node.prepareChild("" + change.name, newValue);
                }
                break;
            case "delete":
                {
                    var oldValue = change.object.get(change.name);
                    node_1.maybeNode(oldValue, function (adm) { return adm.setParent(null); });
                }
                break;
        }
        return change;
    };
    MapType.prototype.serialize = function (node, target) {
        var res = {};
        target.forEach(function (value, key) {
            res[key] = node_1.valueToSnapshot(value);
        });
        return res;
    };
    MapType.prototype.didChange = function (node, change) {
        switch (change.type) {
            case "update":
            case "add":
                return void node.emitPatch({
                    op: change.type === "add" ? "add" : "replace",
                    path: "/" + json_patch_1.escapeJsonPath(change.name),
                    value: node_1.valueToSnapshot(change.newValue)
                }, node);
            case "delete":
                return void node.emitPatch({
                    op: "remove",
                    path: "/" + json_patch_1.escapeJsonPath(change.name)
                }, node);
        }
    };
    MapType.prototype.applyPatchLocally = function (node, target, subpath, patch) {
        switch (patch.op) {
            case "add":
            case "replace":
                target.set(subpath, patch.value);
                break;
            case "remove":
                target.delete(subpath);
                break;
        }
    };
    MapType.prototype.applySnapshot = function (node, target, snapshot) {
        // Try to update snapshot smartly, by reusing instances under the same key as much as possible
        var currentKeys = {};
        target.keys().forEach(function (key) { currentKeys[key] = false; });
        Object.keys(snapshot).forEach(function (key) {
            // if snapshot[key] is non-primitive, and this.get(key) has a Node, update it, instead of replace
            if (key in currentKeys && !utils_1.isPrimitive(snapshot[key])) {
                currentKeys[key] = true;
                node_1.maybeNode(target.get(key), function (propertyNode) {
                    // update existing instance
                    propertyNode.applySnapshot(snapshot[key]);
                }, function () {
                    target.set(key, snapshot[key]);
                });
            }
            else {
                target.set(key, snapshot[key]);
            }
        });
        Object.keys(currentKeys).forEach(function (key) {
            if (currentKeys[key] === false)
                target.delete(key);
        });
    };
    MapType.prototype.getChildFactory = function (key) {
        return this.subType;
    };
    MapType.prototype.isValidSnapshot = function (snapshot) {
        var _this = this;
        return utils_1.isPlainObject(snapshot) && Object.keys(snapshot).every(function (key) { return _this.subType.is(snapshot[key]); });
    };
    return MapType;
}(types_1.ComplexType));
__decorate([
    mobx_1.action
], MapType.prototype, "applySnapshot", null);
exports.MapType = MapType;
function createMapFactory(subtype) {
    return new MapType("map<string, " + subtype.factoryName + ">", subtype).factory;
}
exports.createMapFactory = createMapFactory;
function isMapFactory(factory) {
    return factories_1.isFactory(factory) && factory.type.isMapFactory === true;
}
exports.isMapFactory = isMapFactory;
//# sourceMappingURL=map.js.map