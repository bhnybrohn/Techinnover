"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reminder = exports.Event = exports.dbConfig = void 0;
const sequelize = require("sequelize");
const analytics_1 = require("../model/analytics");
const reminder_1 = require("../model/reminder");
exports.dbConfig = new sequelize.Sequelize({
    host: "ec2-52-45-238-24.compute-1.amazonaws.com",
    port: 5432,
    password: "bffacd7d780bf6fdb85ddb122174e686e6d26780a40d93494726fae3138bf9ae",
    dialect: "postgres",
    database: "dadu7sjaa2217e",
    username: "hybfjstwwdgacb",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000,
    },
});
exports.Event = (0, analytics_1.EventFactory)(exports.dbConfig);
exports.Reminder = (0, reminder_1.ReminderFactory)(exports.dbConfig);
//# sourceMappingURL=db.js.map