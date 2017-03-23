"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factories_1 = require("../core/factories");
var top_level_api_1 = require("../top-level-api");
var utils_1 = require("../utils");
function asReduxStore(model) {
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    utils_1.invariant(factories_1.isModel(model), "Expected model object");
    var store = {
        getState: function () { return top_level_api_1.getSnapshot(model); },
        dispatch: function (action) {
            runMiddleWare(action, runners.slice(), function (newAction) { return top_level_api_1.applyAction(model, reduxActionToAction(newAction)); });
        },
        subscribe: function (listener) { return top_level_api_1.onSnapshot(model, listener); }
    };
    var runners = middlewares.map(function (mw) { return mw(store); });
    return store;
}
exports.asReduxStore = asReduxStore;
function reduxActionToAction(action) {
    var actionArgs = utils_1.extend({}, action);
    delete actionArgs.type;
    return {
        name: action.type,
        args: [actionArgs]
    };
}
function runMiddleWare(action, runners, next) {
    function n(retVal) {
        var f = runners.shift();
        if (f)
            f(n)(retVal);
        else
            next(retVal);
    }
    n(action);
}
//# sourceMappingURL=redux.js.map