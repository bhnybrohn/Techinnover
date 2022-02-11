import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface Analytics {
    id: number;
    eventType: string;
    user: string;
    date?: Date;
    
}
export interface EventModel extends Model<Analytics>, Analytics {}
export class AnalyticsModel extends Model<EventModel, Analytics> {}

export type Static = typeof Model & {
    new (values?: object, options?: BuildOptions): AnalyticsModel;
};

export function EventFactory (sequelize: Sequelize): Static {
    return <Static>sequelize.define("event", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventType: {
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
