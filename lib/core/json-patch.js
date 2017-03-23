"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: move file to utils
var utils_1 = require("../utils");
// TODO: use https://www.npmjs.com/package/json-pointer
/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
function escapeJsonPath(str) {
    return str.replace(/~/g, "~1").replace(/\//g, "~0");
}
exports.escapeJsonPath = escapeJsonPath;
/**
 * unescape slashes and backslashes
 */
function unescapeJsonPath(str) {
    return str.replace(/~0/g, "\\").replace(/~1/g, "~");
}
exports.unescapeJsonPath = unescapeJsonPath;
function joinJsonPath(path) {
    // `/` refers to property with an empty name, while `` refers to root itself!
    if (path.length === 0)
        return "";
    return "/" + path.map(escapeJsonPath).join("/");
}
exports.joinJsonPath = joinJsonPath;
function splitJsonPath(path) {
    // `/` refers to property with an empty name, while `` refers to root itself!
    if (path === "")
        return [];
    utils_1.invariant(path[0] === "/", "Expected path to start with '/', got: '" + path + "'");
    return path.substr(1).split("/").map(unescapeJsonPath);
}
exports.splitJsonPath = splitJsonPath;
//# sourceMappingURL=json-patch.js.map