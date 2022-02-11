"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express = require("express");
const exception_handler_1 = require("./helper/exception.handler");
const NodeCache = require("node-cache");
const morgan = require("morgan");
const sequelize_1 = require("sequelize");
const app = express();
const port = 5000;
const cache = new NodeCache();
app.use(morgan("dev"));
app.use(express.json({
    limit: "50mb",
    type: [
        "application/json",
        "text/plain",
    ],
}));
app.use(express.urlencoded({ extended: true }));
const db_1 = require("./config/db");
const logger_1 = require("./helper/logger");
const db_2 = require("./config/db");
const db_3 = require("./config/db");
db_1.dbConfig
    .authenticate()
    .then(() => {
    console.log("authenticating db success");
})
    .catch((err) => {
    throw new exception_handler_1.HttpException(err.message, 500);
});
db_1.dbConfig
    .sync()
    .then(() => logger_1.logger.info("connected to db"))
    .catch(() => {
    throw "error";
});
// interface reminder {
//   after: number;
//   user: string;
// }
app.get("/", (req, res) => {
    res.send("Welcome World!");
});
app.post("/analytics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const eventPayload = Object.assign(Object.assign({}, data), { time: Date.now() });
        const all = db_2.Event.findAll({});
        console.log(all);
        const lastEvent = cache.get("latestEventType");
        if (!lastEvent) {
            logger_1.logger.info(JSON.stringify("an event occured, " + `${data.eventType}`));
            data.eventType == "click"
                ? cache.set("latestEventType", eventPayload, 3)
                : data.eventType == "pageView"
                    ? cache.set("latestEventType", eventPayload, 5)
                    : logger_1.logger.error("No event type found");
        }
        if (lastEvent && data.eventType == "click") {
            console.log(Date.now() - (lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.time));
            const timer = Date.now() - (lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.time);
            timer <= 3000
                ? db_2.Event.create({
                    user: lastEvent.user,
                    eventType: data.eventType,
                })
                    .then(() => {
                    console.log(` ${lastEvent.eventType} event created`);
                })
                    .catch((err) => console.error(err.message))
                : console.log("last event is expired");
        }
        if (lastEvent && data.eventType == "pageView") {
            console.log(Date.now() - (lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.time));
            const timer = Date.now() - (lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.time);
            timer <= 5000
                ? db_2.Event.create({
                    user: lastEvent.user,
                    eventType: data.eventType,
                })
                    .then(() => {
                    console.log(` ${lastEvent.eventType} event created`);
                })
                    .catch((err) => console.error(err.message))
                : console.log("last event is expired");
        }
        const getAllEvents = yield db_2.Event.findAll({});
        const numberOfEvents = [...getAllEvents];
        //cache latest event type
        res.status(201).send({
            success: true,
            message: "Event received successfully",
            injested: numberOfEvents.length,
            data: eventPayload,
        });
    }
    catch (error) {
        throw new exception_handler_1.HttpException(error.message, 500);
    }
}));
app.get("/analytics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllEvents = yield db_2.Event.findAll({});
        const numberOfEvents = [...getAllEvents];
        res.status(200).send({
            success: true,
            injested: numberOfEvents.length,
            message: "Events retrieved successfully",
            data: getAllEvents,
        });
    }
    catch (error) {
        throw new exception_handler_1.HttpException(error.message, 500);
    }
}));
app.post('/reminders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(data);
    try {
        const saveData = yield db_3.Reminder.create({
            user: data.user,
            description: data.description
        });
        if (saveData)
            return res.status(201).send({
                success: true,
                message: "Reminder created successfully",
                data: data
            });
    }
    catch (error) {
        throw new exception_handler_1.HttpException(error.message, 500);
    }
}));
app.get('/reminders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    try {
        if (!params) {
            const getReminders = yield db_3.Reminder.findAll({});
            res.status(200).send({
                success: true,
                message: "Reminders fetched successfully",
                data: getReminders
            });
        }
        if (params) {
            const { user, after } = req.query;
            const time = Number(after);
            const getAll = yield db_3.Reminder.findAll({
                where: {
                    user: user,
                    date: {
                        [sequelize_1.Op.gte]: time
                    }
                }
            });
            return res.status(200).json({
                success: true,
                message: "Reminders fetched successfully",
                data: getAll
            });
        }
    }
    catch (error) {
        throw new exception_handler_1.HttpException(error.message, 500);
    }
}));
app.get('/reminders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getAnReminder = yield db_3.Reminder.findOne({
            where: { id }
        });
        if (getAnReminder)
            return res.status(200).json({
                success: true,
                message: "Reminder fetched successfully",
                data: getAnReminder
            });
        if (!getAnReminder)
            return res.status(404).json({
                success: false,
                message: "Reminder not found",
                data: null
            });
    }
    catch (error) {
        throw new exception_handler_1.HttpException(error.message, 500);
    }
}));
app.all('/reminders/:id', (req, res) => {
    res.status(405).send({
        message: "Method not allowed"
    });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map