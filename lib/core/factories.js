"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./node");
function isFactory(value) {
    return typeof value === "function" && value.isFactory === true;
}
exports.isFactory = isFactory;
function getFactory(object) {
    return node_1.getNode(object).factory;
}
exports.getFactory = getFactory;
function getChildFactory(object, child) {
    return node_1.getNode(object).getChildFactory(child);
}
exports.getChildFactory = getChildFactory;
// TODO: ambigous function name, remove
function isModel(model) {
    return node_1.hasNode(model);
}
exports.isModel = isModel;
//# sourceMappingURL=factories.js.map