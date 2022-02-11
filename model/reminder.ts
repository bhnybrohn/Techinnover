import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface Reminder {
    id: number;
    description: string;
    user: string;
    date?: Date;
    
}
export interface DataModel extends Model<Reminder>, Reminder {}
export class ReminderModel extends Model<DataModel, Reminder> {}

export type Static = typeof Model & {
    new (values?: object, options?: BuildOptions): ReminderModel;
};

export function ReminderFactory (sequelize: Sequelize): Static {
    return <Static>sequelize.define("reminder", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

    });
}
// EventFactory.init = (sequelize: Sequelize) => {
//     EventFactory(sequelize);
// }
