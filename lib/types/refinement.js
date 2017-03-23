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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var types_1 = require("../core/types");
var node_1 = require("../core/node");
var Refinement = (function (_super) {
    __extends(Refinement, _super);
    function Refinement(name, type, predicate) {
        var _this = _super.call(this, name) || this;
        _this.type = type;
        _this.predicate = predicate;
        return _this;
    }
    Refinement.prototype.describe = function () {
        return this.name;
    };
    Refinement.prototype.create = function (value, environment) {
        // create the child type
        var inst = this.type(value, environment);
        var snapshot = node_1.hasNode(inst) ? node_1.getNode(inst).snapshot : inst;
        // check if pass the predicate
        utils_1.invariant(this.is(snapshot), "Value " + JSON.stringify(snapshot) + " is not assignable to type " + this.name);
        return inst;
    };
    Refinement.prototype.is = function (value) {
        return this.type.is(value) && this.predicate(value);
    };
    return Refinement;
}(types_1.Type));
exports.Refinement = Refinement;
function createRefinementFactory(name, type, predicate) {
    // check if the subtype default value passes the predicate
    var inst = type();
    utils_1.invariant(predicate(node_1.hasNode(inst) ? node_1.getNode(inst).snapshot : inst), "Default value for refinement type " + name + " does not pass the predicate.");
    return new Refinement(name, type, predicate).factory;
}
exports.createRefinementFactory = createRefinementFactory;
//# sourceMappingURL=refinement.js.map