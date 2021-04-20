"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirdeeClient = exports.AuthStatus = void 0;
var node_fetch_1 = require("node-fetch");
var util_1 = require("./util");
var AuthStatus;
(function (AuthStatus) {
    AuthStatus["noAuth"] = "noAuth";
    AuthStatus["auth"] = "auth";
})(AuthStatus = exports.AuthStatus || (exports.AuthStatus = {}));
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(message) {
        return _super.call(this, message) || this;
    }
    return RequestError;
}(Error));
var VirdeeClient = /** @class */ (function () {
    function VirdeeClient(url, options) {
        this.interval = 200;
        this.url = url;
        this.bearerToken = options.bearerToken || "";
        this.log = options.logger;
        this.reqId = options.reqId;
        this.retries = options.retries || 5;
    }
    VirdeeClient.prototype.sendGraphQL = function (query, authStatus, variables) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.internalSendGraphQL(query, authStatus, variables)];
            });
        });
    };
    VirdeeClient.prototype.sendGraphQLAuth = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.internalSendGraphQL(query, AuthStatus.auth, variables)];
            });
        });
    };
    VirdeeClient.prototype.sendGraphQLUnauth = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.internalSendGraphQL(query, AuthStatus.noAuth, variables)];
            });
        });
    };
    VirdeeClient.prototype.internalSendGraphQL = function (query, authorized, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, response, jsonResponse, error_1, textResponse, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = {
                            "Content-Type": "application/json",
                            "X-Request-ID": this.reqId,
                        };
                        if (authorized === AuthStatus.auth) {
                            headers["Authorization"] = "Bearer " + this.bearerToken;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, node_fetch_1.default(this.url, {
                                method: "POST",
                                headers: headers,
                                body: JSON.stringify({ query: query, variables: variables }),
                            })];
                    case 2:
                        response = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 8]);
                        if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        jsonResponse = _a.sent();
                        return [2 /*return*/, jsonResponse];
                    case 5: 
                    // If response not okay, throw.
                    throw new Error("Response is not ok");
                    case 6:
                        error_1 = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 7:
                        textResponse = _a.sent();
                        message = util_1.generateErrorMessage(error_1);
                        throw new Error("errorMessage: " + message + "; responseText: " + textResponse + "; responseStatus: " + response.status);
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _a.sent();
                        message = util_1.generateErrorMessage(error_2);
                        throw new Error(message);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return VirdeeClient;
}());
exports.VirdeeClient = VirdeeClient;
//# sourceMappingURL=virdeeClient.js.map