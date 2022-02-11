"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
exports.logger = (0, winston_1.createLogger)({
    levels: logLevels,
    transports: [new winston_1.transports.Console()],
});
//# sourceMappingURL=logger.js.map