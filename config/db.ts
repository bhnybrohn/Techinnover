import * as sequelize from "sequelize";
import { EventFactory } from "../model/analytics";
import { ReminderFactory} from '../model/reminder';

export const dbConfig = new sequelize.Sequelize({
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

export const Event = EventFactory(dbConfig);
export const Reminder = ReminderFactory(dbConfig);

