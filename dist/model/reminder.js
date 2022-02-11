"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderFactory = exports.ReminderModel = void 0;
const sequelize_1 = require("sequelize");
class ReminderModel extends sequelize_1.Model {
}
exports.ReminderModel = ReminderModel;
function ReminderFactory(sequelize) {
    return sequelize.define("reminder", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
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
exports.ReminderFactory = ReminderFactory;
// EventFactory.init = (sequelize: Sequelize) => {
//     EventFactory(sequelize);
// }
//# sourceMappingURL=reminder.js.map