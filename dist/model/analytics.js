"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventFactory = exports.AnalyticsModel = void 0;
const sequelize_1 = require("sequelize");
class AnalyticsModel extends sequelize_1.Model {
}
exports.AnalyticsModel = AnalyticsModel;
function EventFactory(sequelize) {
    return sequelize.define("event", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
}
exports.EventFactory = EventFactory;
// EventFactory.init = (sequelize: Sequelize) => {
//     EventFactory(sequelize);
// }
//# sourceMappingURL=analytics.js.map