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
var utils_1 = require("../utils");
var node_1 = require("../core/node");
var factories_1 = require("../core/factories");
var action_1 = require("../core/action");
var json_patch_1 = require("../core/json-patch");
var reference_1 = require("./reference");
var primitive_1 = require("./primitive");
var types_1 = require("../core/types");
var ObjectType = (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType(name, baseModel) {
        var _this = _super.call(this, name) || this;
        _this.props = {};
        _this.initializers = [];
        _this.finalizers = [];
        _this.isObjectFactory = true;
        Object.seal(baseModel); // make sure nobody messes with it
        _this.baseModel = baseModel;
        _this.extractPropsFromBaseModel();
        return _this;
    }
    ObjectType.prototype.describe = function () {
        var _this = this;
        return "{ " + Object.keys(this.props).map(function (key) { return key + ": " + _this.props[key].type.describe(); }).join("; ") + " }";
    };
    ObjectType.prototype.createNewInstance = function () {
        var instance = mobx_1.observable.shallowObject({});
        this.initializers.forEach(function (f) { return f(instance); });
        return instance;
    };
    ObjectType.prototype.finalizeNewInstance = function (instance) {
        this.finalizers.forEach(function (f) { return f(instance); });
        // TODO: Object.seal(instance) // don't allow new props to be added!
    };
    ObjectType.prototype.extractPropsFromBaseModel = function () {
        var baseModel = this.baseModel;
        var addInitializer = this.initializers.push.bind(this.initializers);
        var addFinalizer = this.finalizers.push.bind(this.finalizers);
        var _loop_1 = function (key) {
            if (utils_1.hasOwnProperty(baseModel, key)) {
                var descriptor = Object.getOwnPropertyDescriptor(baseModel, key);
                if ("get" in descriptor) {
                    var computedDescriptor_1 = {}; // yikes
                    Object.defineProperty(computedDescriptor_1, key, descriptor);
                    addInitializer(function (t) { return mobx_1.extendShallowObservable(t, computedDescriptor_1); });
                    return "continue";
                }
                var value_1 = descriptor.value;
                if (utils_1.isPrimitive(value_1)) {
                    // TODO: detect exact primitiveFactory!
                    this_1.props[key] = primitive_1.primitiveFactory;
                    // MWE: optimization, create one single extendObservale
                    addInitializer(function (t) {
                        return mobx_1.extendShallowObservable(t, (_a = {}, _a[key] = value_1, _a));
                        var _a;
                    });
                }
                else if (factories_1.isFactory(value_1)) {
                    this_1.props[key] = value_1;
                    addInitializer(function (t) {
                        return mobx_1.extendShallowObservable(t, (_a = {}, _a[key] = null, _a));
                        var _a;
                    });
                    addFinalizer(function (t) { return t[key] = value_1(); });
                }
                else if (reference_1.isReferenceFactory(value_1)) {
                    addInitializer(function (t) { return mobx_1.extendShallowObservable(t, reference_1.createReferenceProps(key, value_1)); });
                }
                else if (mobx_1.isAction(value_1)) {
                    addInitializer(function (t) { return action_1.createActionWrapper(t, key, value_1); });
                }
                else if (typeof value_1 === "function") {
                    addInitializer(function (t) { return action_1.createNonActionWrapper(t, key, value_1); });
                }
                else if (typeof value_1 === "object") {
                    utils_1.fail("In property '" + key + "': base model's should not contain complex values: '" + value_1 + "'");
                }
                else {
                    utils_1.fail("Unexpected value for property '" + key + "'");
                }
            }
        };
        var this_1 = this;
        for (var key in baseModel) {
            _loop_1(key);
        }
    };
    // TODO: adm or instance as param?
    ObjectType.prototype.getChildNodes = function (node, instance) {
        var res = [];
        var _loop_2 = function (key) {
            node_1.maybeNode(instance[key], function (propertyNode) { return res.push([key, propertyNode]); });
        };
        for (var key in this.props) {
            _loop_2(key);
        }
        return res;
    };
    ObjectType.prototype.getChildNode = function (node, instance, key) {
        return node_1.maybeNode(instance[key], utils_1.identity, utils_1.nothing);
    };
    ObjectType.prototype.willChange = function (node, change) {
        var newValue = change.newValue;
        var oldValue = change.object[change.name];
        if (newValue === oldValue)
            return null;
        node_1.maybeNode(oldValue, function (adm) { return adm.setParent(null); });
        change.newValue = node.prepareChild(change.name, newValue);
        return change;
    };
    ObjectType.prototype.didChange = function (node, change) {
        switch (change.type) {
            case "update": return void node.emitPatch({
                op: "replace",
                path: "/" + json_patch_1.escapeJsonPath(change.name),
                value: node_1.valueToSnapshot(change.newValue)
            }, node);
            case "add": return void node.emitPatch({
                op: "add",
                path: "/" + json_patch_1.escapeJsonPath(change.name),
                value: node_1.valueToSnapshot(change.newValue)
            }, node);
        }
    };
    ObjectType.prototype.serialize = function (node, instance) {
        var res = {};
        for (var key in this.props) {
            var value = instance[key];
            if (!utils_1.isSerializable(value))
                console.warn("Encountered unserialize value '" + value + "' in " + node.path + "/" + key);
            res[key] = node_1.valueToSnapshot(value);
        }
        return res;
    };
    ObjectType.prototype.applyPatchLocally = function (node, target, subpath, patch) {
        utils_1.invariant(patch.op === "replace" || patch.op === "add");
        this.applySnapshot(node, target, (_a = {},
            _a[subpath] = patch.value,
            _a));
        var _a;
    };
    ObjectType.prototype.applySnapshot = function (node, target, snapshot) {
        var _loop_3 = function (key) {
            utils_1.invariant(key in this_2.props, "It is not allowed to assign a value to non-declared property " + key + " of " + this_2.name);
            node_1.maybeNode(target[key], function (propertyNode) { propertyNode.applySnapshot(snapshot[key]); }, function () { target[key] = snapshot[key]; });
        };
        var this_2 = this;
        for (var key in snapshot) {
            _loop_3(key);
        }
    };
    ObjectType.prototype.getChildFactory = function (key) {
        return this.props[key] || primitive_1.primitiveFactory;
    };
    ObjectType.prototype.isValidSnapshot = function (snapshot) {
        if (!utils_1.isPlainObject(snapshot))
            return false;
        var props = this.props;
        var modelKeys = Object.keys(props).filter(function (key) { return utils_1.isPrimitive(props[key]) || factories_1.isFactory(props[key]); });
        var snapshotKeys = Object.keys(snapshot);
        if (snapshotKeys.length > modelKeys.length)
            return false;
        return snapshotKeys.every(function (key) {
            var keyInConfig = key in props;
            var bothArePrimitives = utils_1.isPrimitive(props[key]) && utils_1.isPrimitive(snapshot[key]);
            var ifModelFactoryIsCastable = factories_1.isFactory(props[key]) && props[key].is(snapshot[key]);
            return keyInConfig && (bothArePrimitives || ifModelFactoryIsCastable);
        });
    };
    return ObjectType;
}(types_1.ComplexType));
__decorate([
    mobx_1.action
], ObjectType.prototype, "applySnapshot", null);
exports.ObjectType = ObjectType;
function createModelFactory(arg1, arg2) {
    var name = typeof arg1 === "string" ? arg1 : "unnamed-object-factory";
    var baseModel = typeof arg1 === "string" ? arg2 : arg1;
    return new ObjectType(name, baseModel).factory;
}
exports.createModelFactory = createModelFactory;
function getObjectFactoryBaseModel(item) {
    var factory = factories_1.isFactory(item) ? item : factories_1.getFactory(item);
    return isObjectFactory(factory) ? factory.type.baseModel : {};
}
function composeFactory() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var factoryName = typeof args[0] === "string" ? args[0] : "unnamed-factory";
    var baseModels = typeof args[0] === "string" ? args.slice(1) : args;
    return createModelFactory(factoryName, utils_1.extend.apply(null, [{}].concat(baseModels.map(getObjectFactoryBaseModel))));
}
exports.composeFactory = composeFactory;
function isObjectFactory(factory) {
    return factories_1.isFactory(factory) && factory.type.isObjectFactory === true;
}
exports.isObjectFactory = isObjectFactory;
// export function getObjectNode(thing: IModel): ObjectNode {
//     const node = getNode(thing)
//     invariant(isObjectFactory(node.factory), "Expected object node, got " + (node.constructor as any).name)
//     return node as ObjectNode
// }
// /**
//  * Returns first parent of the provided node that is an object node, or null
//  */
// export function findEnclosingObjectNode(thing: Node): ObjectNode | null {
//     let parent: Node | null = thing
//     while (parent = parent.parent)
//         if (parent instanceof ObjectNode)
//             return parent
//     return null
// }
//# sourceMappingURL=object.js.map