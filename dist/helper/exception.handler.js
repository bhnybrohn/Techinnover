"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
//# sourceMappingURL=exception.handler.js.map