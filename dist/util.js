"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorMessage = void 0;
exports.generateErrorMessage = function (error) {
    var message = "Unknown error";
    if (error instanceof Error) {
        message = error.message;
    }
    return message;
};
//# sourceMappingURL=util.js.map