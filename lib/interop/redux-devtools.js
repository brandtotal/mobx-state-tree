"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var top_level_api_1 = require("../top-level-api");
var _a = require("remotedev"), connectViaExtension = _a.connectViaExtension, extractState = _a.extractState;
function connectReduxDevtools(model) {
    // Connect to the monitor
    var remotedev = connectViaExtension();
    var applyingSnapshot = false;
    // Subscribe to change state (if need more than just logging)
    remotedev.subscribe(function (message) {
        // Helper when only time travelling needed
        var state = extractState(message);
        if (state) {
            applyingSnapshot = true;
            top_level_api_1.applySnapshot(model, state);
            applyingSnapshot = false;
        }
    });
    // Send changes to the remote monitor
    top_level_api_1.onAction(model, function (action, next) {
        next();
        if (applyingSnapshot)
            return;
        var copy = {};
        copy.type = action.name;
        if (action.args)
            action.args.forEach(function (value, index) { return copy[index] = value; });
        remotedev.send(copy, top_level_api_1.getSnapshot(model));
    });
}
exports.connectReduxDevtools = connectReduxDevtools;
//# sourceMappingURL=redux-devtools.js.map