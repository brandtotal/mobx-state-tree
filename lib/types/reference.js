// TODO: move file to better place, not really a type
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factories_1 = require("../core/factories");
var top_level_api_1 = require("../top-level-api");
var utils_1 = require("../utils");
var node_1 = require("../core/node");
function reference(arg1, arg2) {
    if (factories_1.isFactory(arg1))
        return createGenericRelativeReference(arg1);
    if (typeof arg1 === "string")
        return createRelativeReferenceTo(arg1);
    return {
        isReference: true,
        getter: arg1,
        setter: arg2 || unwritableReference
    };
}
exports.reference = reference;
function createRelativeReferenceTo(path) {
    // TODO: remove this option?
    var targetIdAttribute = path.split("/").slice(-1)[0];
    path = path.split("/").slice(0, -1).join("/");
    return reference(function (identifier, owner) { return top_level_api_1.resolve(owner, path + "/" + identifier); }, function (value, owner, name) {
        utils_1.invariant(!value || (node_1.getNode(value).root === node_1.getNode(owner).root), "The value assigned to the reference '" + name + "' should already be part of the same model tree");
        return value[targetIdAttribute];
    });
}
function createGenericRelativeReference(factory) {
    // TODO: store as {$ref: "..."} instead of just the string
    return reference(function (identifier, owner) {
        if (identifier === null || identifier === undefined)
            return identifier;
        return top_level_api_1.resolve(owner, identifier);
    }, function (value, owner, name) {
        if (value === null || value === undefined)
            return value;
        utils_1.invariant(factories_1.isModel(value), "The value assigned to the reference '" + name + "' is not a model instance");
        utils_1.invariant(factory.is(value), "The value assigned to the reference '" + name + "' is not a model of type " + factory);
        var base = node_1.getNode(owner);
        var target = node_1.getNode(value);
        utils_1.invariant(base.root === target.root, "The value assigned to the reference '" + name + "' should already be part of the same model tree");
        return node_1.getRelativePath(base, target);
    });
}
function createReferenceProps(name, ref) {
    var sourceIdAttribute = name + "_id";
    var res = (_a = {},
        _a[sourceIdAttribute] = "" // the raw attribute value
    ,
        _a);
    Object.defineProperty(res, name, {
        get: function () {
            // Optimization: reuse closures based on the same name or configuration
            var id = this[sourceIdAttribute];
            return id ? ref.getter(id, this, name) : null;
        },
        set: function (v) {
            utils_1.invariant(node_1.getNode(this).isRunningAction(), "Reference '" + name + "' can only be modified from within an action");
            this[sourceIdAttribute] = v ? ref.setter(v, this, name) : "";
        },
        enumerable: true
    });
    return res;
    var _a;
}
exports.createReferenceProps = createReferenceProps;
function unwritableReference(_, owner, propertyName) {
    return utils_1.fail("Cannot assign a new value to the reference '" + propertyName + "', the reference is read-only");
}
function isReferenceFactory(thing) {
    return thing.isReference === true;
}
exports.isReferenceFactory = isReferenceFactory;
//# sourceMappingURL=reference.js.map