"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./map");
var array_1 = require("./array");
var primitive_1 = require("./primitive");
var primitive_2 = require("./primitive");
var object_1 = require("./object");
var reference_1 = require("./reference");
var union_1 = require("./union");
var with_default_1 = require("./with-default");
var literal_1 = require("./literal");
var maybe_1 = require("./maybe");
var refinement_1 = require("./refinement");
var frozen_1 = require("./frozen");
var core_types_1 = require("./core-types");
var recursive_1 = require("./recursive");
/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
function map(subFactory) {
    if (subFactory === void 0) { subFactory = primitive_1.primitiveFactory; }
    return map_1.createMapFactory(subFactory);
}
exports.map = map;
/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
function array(subFactory) {
    if (subFactory === void 0) { subFactory = primitive_1.primitiveFactory; }
    return array_1.createArrayFactory(subFactory);
}
exports.array = array;
exports.types = {
    primitive: primitive_2.primitiveFactory,
    struct: object_1.createModelFactory,
    extend: object_1.composeFactory,
    reference: reference_1.reference,
    union: union_1.createUnionFactory,
    withDefault: with_default_1.createDefaultValueFactory,
    literal: literal_1.createLiteralFactory,
    maybe: maybe_1.createMaybeFactory,
    refinement: refinement_1.createRefinementFactory,
    string: core_types_1.string,
    boolean: core_types_1.boolean,
    number: core_types_1.number,
    map: map,
    array: array,
    frozen: frozen_1.frozen,
    recursive: recursive_1.recursive
};
//# sourceMappingURL=index.js.map