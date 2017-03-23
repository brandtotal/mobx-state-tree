"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var union_1 = require("./union");
var literal_1 = require("./literal");
var nullFactory = literal_1.createLiteralFactory(null);
function createMaybeFactory(type) {
    return union_1.createUnionFactory(nullFactory, type);
}
exports.createMaybeFactory = createMaybeFactory;
//# sourceMappingURL=maybe.js.map