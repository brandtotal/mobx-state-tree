"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fail(message) {
    if (message === void 0) { message = "Illegal state"; }
    invariant(false, message);
    throw "!";
}
exports.fail = fail;
// Optimize: accept () => string as message, so string doesn't have to be prepared at runtime
function invariant(cond, message) {
    if (message === void 0) { message = "Illegal state"; }
    if (!cond)
        throw new Error("[mobx-state-tree] " + message);
}
exports.invariant = invariant;
function identity(_) {
    return _;
}
exports.identity = identity;
function nothing() {
    return null;
}
exports.nothing = nothing;
function extend(a) {
    var b = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        b[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < b.length; i++) {
        var current = b[i];
        for (var key in current)
            a[key] = current[key];
    }
    return a;
}
exports.extend = extend;
function isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
exports.isPlainObject = isPlainObject;
function isMutable(value) {
    return value !== null && typeof value === "object" && !(value instanceof Date) && !(value instanceof RegExp);
}
exports.isMutable = isMutable;
function isPrimitive(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value instanceof Date)
        return true;
    return false;
}
exports.isPrimitive = isPrimitive;
function isSerializable(value) {
    return typeof value !== "function";
}
exports.isSerializable = isSerializable;
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
exports.addHiddenFinalProp = addHiddenFinalProp;
function addReadOnlyProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: true,
        writable: false,
        configurable: true,
        value: value
    });
}
exports.addReadOnlyProp = addReadOnlyProp;
function registerEventHandler(handlers, handler) {
    handlers.push(handler);
    return function () {
        var idx = handlers.indexOf(handler);
        if (idx !== -1)
            handlers.splice(idx, 1);
    };
}
exports.registerEventHandler = registerEventHandler;
var prototypeHasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(object, propName) {
    return prototypeHasOwnProperty.call(object, propName);
}
exports.hasOwnProperty = hasOwnProperty;
//# sourceMappingURL=utils.js.map