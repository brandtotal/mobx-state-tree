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
function freeze(value) {
    Object.freeze(value);
    if (utils_1.isPlainObject(value)) {
        Object.keys(value).forEach(function (propKey) {
            if (!Object.isFrozen(value[propKey])) {
                freeze(value[propKey]);
            }
        });
    }
    return value;
}
var Frozen = (function (_super) {
    __extends(Frozen, _super);
    function Frozen() {
        return _super.call(this, "frozen") || this;
    }
    Frozen.prototype.describe = function () {
        return "frozen";
    };
    Frozen.prototype.create = function (value, environment) {
        utils_1.invariant(utils_1.isSerializable(value), "Given value should be serializable");
        // deep freeze the object/array
        return utils_1.isMutable(value) ? freeze(value) : value;
    };
    Frozen.prototype.is = function (value) {
        return utils_1.isSerializable(value);
    };
    return Frozen;
}(types_1.Type));
exports.Frozen = Frozen;
exports.frozen = new Frozen().factory;
//# sourceMappingURL=frozen.js.map