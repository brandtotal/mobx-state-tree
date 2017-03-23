"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var types_1 = require("./types");
var utils_1 = require("../utils");
var json_patch_1 = require("./json-patch");
var action_1 = require("./action");
var object_1 = require("../types/object");
// TODO: make Node more like a struct, extract the methods to snapshots.js, actions.js etc..
var Node = (function () {
    function Node(initialState, environment, factory) {
        var _this = this;
        this._parent = null;
        this.snapshotSubscribers = [];
        this.patchSubscribers = [];
        this.actionSubscribers = [];
        this._isRunningAction = false; // only relevant for root
        utils_1.invariant(factory.type instanceof types_1.ComplexType, "Uh oh");
        utils_1.addHiddenFinalProp(initialState, "$treenode", this);
        this.factory = factory;
        this.environment = environment;
        this.target = initialState;
        this.interceptDisposer = mobx_1.intercept(this.target, (function (c) { return _this.type.willChange(_this, c); }));
        mobx_1.observe(this.target, function (c) { return _this.type.didChange(_this, c); });
        mobx_1.reaction(function () { return _this.snapshot; }, function (snapshot) {
            _this.snapshotSubscribers.forEach(function (f) { return f(snapshot); });
        });
        // dispose reaction, observe, intercept somewhere explicitly? Should strictly speaking not be needed for GC
    }
    Object.defineProperty(Node.prototype, "type", {
        get: function () {
            return this.factory.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "pathParts", {
        get: function () {
            var _this = this;
            // no parent? you are root!
            if (this._parent === null) {
                return [];
            }
            // get the key
            // optimize: maybe this shouldn't be computed, this is called often and pretty expensive lookup ...
            var keys = this._parent.getChildNodes()
                .filter(function (entry) { return entry[1] === _this; });
            if (keys.length > 0) {
                var key = keys[0][0];
                return this._parent.pathParts.concat([key]);
            }
            return utils_1.fail("Illegal state");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "path", {
        /**
         * Returnes (escaped) path representation as string
         */
        get: function () {
            return json_patch_1.joinJsonPath(this.pathParts);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "subpath", {
        get: function () {
            if (this.isRoot)
                return "";
            var parts = this.pathParts;
            return parts[parts.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isRoot", {
        get: function () {
            return this._parent === null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "root", {
        get: function () {
            // future optimization: store root ref in the node and maintain it
            var p, r = this;
            while (p = r.parent)
                r = p;
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "snapshot", {
        get: function () {
            // advantage of using computed for a snapshot is that nicely respects transactions etc.
            return Object.freeze(this.type.serialize(this, this.target));
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.onSnapshot = function (onChange) {
        return utils_1.registerEventHandler(this.snapshotSubscribers, onChange);
    };
    Node.prototype.applySnapshot = function (snapshot) {
        utils_1.invariant(this.type.is(snapshot), "Snapshot " + JSON.stringify(snapshot) + " is not assignable to type " + this.factory.type.name + ". Expected " + this.factory.type.describe() + " instead.");
        return this.type.applySnapshot(this, this.target, snapshot);
    };
    Node.prototype.applyPatch = function (patch) {
        var parts = json_patch_1.splitJsonPath(patch.path);
        var node = this.resolvePath(parts.slice(0, -1));
        node.applyPatchLocally(parts[parts.length - 1], patch);
    };
    Node.prototype.applyPatchLocally = function (subpath, patch) {
        this.type.applyPatchLocally(this, this.target, subpath, patch);
    };
    Node.prototype.onPatch = function (onPatch) {
        return utils_1.registerEventHandler(this.patchSubscribers, onPatch);
    };
    Node.prototype.emitPatch = function (patch, source, distance) {
        if (distance === void 0) { distance = 0; }
        if (this.patchSubscribers.length) {
            var localizedPatch_1;
            if (distance === 0)
                localizedPatch_1 = patch;
            else
                localizedPatch_1 = utils_1.extend({}, patch, {
                    path: getRelativePath(this, source) + patch.path
                });
            this.patchSubscribers.forEach(function (f) { return f(localizedPatch_1); });
        }
        if (this.parent)
            this.parent.emitPatch(patch, this, distance + 1);
    };
    Node.prototype.setParent = function (newParent, subpath) {
        if (subpath === void 0) { subpath = null; }
        if (this.parent === newParent)
            return;
        if (this._parent && newParent) {
            utils_1.invariant(false, "A node cannot exists twice in the state tree. Failed to add object to path '/" + newParent.pathParts.concat(subpath).join("/") + "', it exists already at '" + this.path + "'");
        }
        if (!this._parent && newParent && newParent.root === this) {
            utils_1.invariant(false, "A state tree is not allowed to contain itself. Cannot add root to path '/" + newParent.pathParts.concat(subpath).join("/") + "'");
        }
        if (this.parent && !newParent && (this.patchSubscribers.length > 0 || this.snapshotSubscribers.length > 0 ||
            (this instanceof object_1.ObjectType && this.actionSubscribers.length > 0))) {
            console.warn("An object with active event listeners was removed from the tree. This might introduce a memory leak. Use detach() if this is intentional");
        }
        this._parent = newParent;
    };
    Node.prototype.prepareChild = function (subpath, child) {
        var childFactory = this.getChildFactory(subpath);
        if (hasNode(child)) {
            var node = getNode(child);
            if (node.isRoot) {
                // we are adding a node with no parent (first insert in the tree)
                node.setParent(this, subpath);
                return child;
            }
            return utils_1.fail("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" + this.path + "/" + subpath + "', but it lives already at '" + getPath(child) + "'");
        }
        var existingNode = this.getChildNode(subpath);
        var newInstance = childFactory(child);
        if (existingNode && existingNode.factory === newInstance.factory) {
            // recycle instance..
            existingNode.applySnapshot(child);
            return existingNode.target;
        }
        else {
            if (existingNode)
                existingNode.setParent(null); // TODO: or delete / remove / whatever is a more explicit clean up
            if (hasNode(newInstance)) {
                var node = getNode(newInstance);
                node.setParent(this, subpath);
            }
            return newInstance;
        }
    };
    Node.prototype.detach = function () {
        // TODO: change to return a clone
        // TODO: detach / remove marks as End of life!...
        if (this.isRoot)
            return;
        if (mobx_1.isObservableArray(this.parent.target))
            this.parent.target.splice(parseInt(this.subpath), 1);
        else if (mobx_1.isObservableMap(this.parent.target))
            this.parent.target.delete(this.subpath);
        else
            this.parent.target[this.subpath] = null;
    };
    Node.prototype.resolve = function (path, failIfResolveFails) {
        if (failIfResolveFails === void 0) { failIfResolveFails = true; }
        return this.resolvePath(json_patch_1.splitJsonPath(path), failIfResolveFails);
    };
    Node.prototype.resolvePath = function (pathParts, failIfResolveFails) {
        if (failIfResolveFails === void 0) { failIfResolveFails = true; }
        var current = this;
        for (var i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "..")
                current = current.parent;
            else if (pathParts[i] === ".")
                continue;
            else
                current = current.getChildNode(pathParts[i]);
            if (current === null) {
                if (failIfResolveFails)
                    return utils_1.fail("Could not resolve'" + pathParts[i] + "' in '" + json_patch_1.joinJsonPath(pathParts.slice(0, i - 1)) + "', path of the patch does not resolve");
                else
                    return undefined;
            }
        }
        return current;
    };
    Node.prototype.isRunningAction = function () {
        if (this._isRunningAction)
            return true;
        if (this.isRoot)
            return false;
        return this.parent.isRunningAction();
    };
    Node.prototype.applyAction = function (action) {
        var targetNode = this.resolve(action.path || "");
        if (targetNode)
            action_1.applyActionLocally(targetNode, targetNode.target, action);
        else
            utils_1.fail("Invalid action path: " + (action.path || ""));
    };
    Node.prototype.emitAction = function (instance, action, next) {
        var _this = this;
        var idx = -1;
        var correctedAction = this.actionSubscribers.length
            ? utils_1.extend({}, action, { path: getRelativePath(this, instance) })
            : null;
        var n = function () {
            // optimization: use tail recursion / trampoline
            idx++;
            if (idx < _this.actionSubscribers.length) {
                return _this.actionSubscribers[idx](correctedAction, n);
            }
            else {
                var parent_1 = _this.parent;
                if (parent_1)
                    return parent_1.emitAction(instance, action, next);
                else
                    return next();
            }
        };
        return n();
    };
    Node.prototype.onAction = function (listener) {
        return utils_1.registerEventHandler(this.actionSubscribers, listener);
    };
    Node.prototype.getFromEnvironment = function (key) {
        if (this.environment && this.environment.hasOwnProperty(key))
            return this.environment[key];
        if (this.isRoot)
            return utils_1.fail("Undefined environment variable '" + key + "'");
        return this.parent.getFromEnvironment(key);
    };
    Node.prototype.getChildNode = function (subpath) {
        return this.type.getChildNode(this, this.target, subpath);
    };
    Node.prototype.getChildNodes = function () {
        return this.type.getChildNodes(this, this.target);
    };
    Node.prototype.getChildFactory = function (key) {
        return this.type.getChildFactory(key);
    };
    return Node;
}());
__decorate([
    mobx_1.observable
], Node.prototype, "_parent", void 0);
__decorate([
    mobx_1.computed
], Node.prototype, "pathParts", null);
__decorate([
    mobx_1.computed
], Node.prototype, "path", null);
__decorate([
    mobx_1.computed
], Node.prototype, "subpath", null);
__decorate([
    mobx_1.computed
], Node.prototype, "snapshot", null);
__decorate([
    mobx_1.action
], Node.prototype, "applyPatch", null);
exports.Node = Node;
// TODO: duplicate with isModel
function hasNode(value) {
    return value && value.$treenode;
}
exports.hasNode = hasNode;
/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
function maybeNode(value, asNodeCb, asPrimitiveCb) {
    // Optimization: maybeNode might be quite inefficient runtime wise, might be factored out at expensive places
    if (utils_1.isMutable(value)) {
        var n = getNode(value);
        return asNodeCb(n, n.target);
    }
    else if (asPrimitiveCb) {
        return asPrimitiveCb(value);
    }
    else {
        return value;
    }
}
exports.maybeNode = maybeNode;
function getNode(value) {
    if (hasNode(value))
        return value.$treenode;
    else
        return utils_1.fail("element has no Node");
}
exports.getNode = getNode;
function getPath(thing) {
    return getNode(thing).path;
}
exports.getPath = getPath;
function getRelativePath(base, target) {
    // PRE condition target is (a child of) base!
    utils_1.invariant(base.root === target.root, "Cannot calculate relative path: objects '" + base + "' and '" + target + "' are not part of the same object tree");
    var baseParts = base.pathParts;
    var targetParts = target.pathParts;
    var common = 0;
    for (; common < baseParts.length; common++) {
        if (baseParts[common] !== targetParts[common])
            break;
    }
    return json_patch_1.joinJsonPath(baseParts
        .slice(common).map(function (_) { return ".."; })
        .concat(targetParts.slice(common)));
}
exports.getRelativePath = getRelativePath;
function getParent(thing) {
    var node = getNode(thing);
    return node.parent ? node.parent.target : null;
}
exports.getParent = getParent;
function valueToSnapshot(thing) {
    if (thing instanceof Date) {
        return {
            $treetype: "Date",
            time: thing.toJSON()
        };
    }
    if (hasNode(thing))
        return getNode(thing).snapshot;
    if (utils_1.isSerializable(thing))
        return thing;
    utils_1.fail("Unable to convert value to snapshot.");
}
exports.valueToSnapshot = valueToSnapshot;
//# sourceMappingURL=node.js.map