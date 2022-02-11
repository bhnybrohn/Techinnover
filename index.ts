/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from "express";
import { HttpException } from "./helper/exception.handler";
import * as NodeCache from "node-cache";
import * as morgan from "morgan";
import { Op } from "sequelize";

const app = express();
const port = 5000;
const cache = new NodeCache();

app.use(morgan("dev"));
app.use(
    express.json({
      limit: "50mb",
      type: [
        "application/json",
        "text/plain",
      ],
    })
  ); 
  app.use(express.urlencoded({ extended: true }));

import { dbConfig } from "./config/db";
import { logger } from "./helper/logger";
import { Event } from "./config/db";
import { Reminder } from "./config/db";

dbConfig
  .authenticate()
  .then(() => {
    console.log("authenticating db success");
  })
  .catch((err) => {
    throw new HttpException(err.message, 500);
  });

dbConfig
  .sync()
  .then(() => logger.info("connected to db"))
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

app.post("/analytics", async(req, res) => {
  try {
    const data = req.body;

    const eventPayload = {
      ...data,
      time: Date.now(),
    };

    const all = Event.findAll({});
    console.log(all);

    const lastEvent: any = cache.get("latestEventType");

    if (!lastEvent) {
      logger.info(JSON.stringify("an event occured, " + `${data.eventType}`));

      data.eventType == "click"
        ? cache.set("latestEventType", eventPayload, 3)
        : data.eventType == "pageView"
        ? cache.set("latestEventType", eventPayload, 5)
        : logger.error("No event type found");
    }

    if (lastEvent && data.eventType == "click") {
      console.log(Date.now() - lastEvent?.time);

      const timer: number = Date.now() - lastEvent?.time;

      timer <= 3000
        ? Event.create({
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
      console.log(Date.now() - lastEvent?.time);

      const timer: number = Date.now() - lastEvent?.time;

      timer <= 5000
        ? Event.create({
            user: lastEvent.user,
            eventType: data.eventType,
          })
            .then(() => {
              console.log(` ${lastEvent.eventType} event created`);
            })
            .catch((err) => console.error(err.message))
        : console.log("last event is expired");
    }

    const getAllEvents = await Event.findAll({});
    const numberOfEvents = [...getAllEvents];

    //cache latest event type

    res.status(201).send({
      success: true,
      message: "Event received successfully",
      injested: numberOfEvents.length,
      data: eventPayload,
    });
  } catch (error) {
    throw new HttpException(error.message, 500);
  }
});
app.get("/analytics", async (req, res) => {
  try {
    const getAllEvents = await Event.findAll({});
    const numberOfEvents = [...getAllEvents];

    res.status(200).send({
      success: true,
      injested: numberOfEvents.length,
      message: "Events retrieved successfully",
      data: getAllEvents,
    });
  } catch (error) {
    throw new HttpException(error.message, 500);
  }
});

app.post('/reminders', async (req, res) => {

    const data = req.body

    console.log(data)

    try {
        const saveData = await Reminder.create({
           user: data.user,
           description: data.description 
        })
        if(saveData) return res.status(201).send({
            success: true,
            message: "Reminder created successfully",
            data: data
        })
    } catch (error) {
        throw new HttpException(error.message, 500);
        
    }

})
app.get('/reminders', async (req, res)=>{

    const params = req.query
    
    try {
          if(!params){
              const getReminders = await Reminder.findAll({})

              res.status(200).send({
                  success: true,
                  message: "Reminders fetched successfully",
                  data: getReminders
              })
          }
          if(params){
            
              const {user, after} = req.query
              const time = Number(after)
              const epochTpISO = new Date(time).toISOString()

              const getAll = await Reminder.findAll({
                where:{
                    user: user,
                    date:{
                      [Op.gte]: epochTpISO
                    }
                }
              })

              return res.status(200).json({
                  success: true,
                  message: "Reminders fetched successfully",
                  data: getAll
              })
          }
        
    } catch (error) {
        throw new HttpException(error.message, 500);
        
    }
})

app.get('/reminders/:id',async (req, res) => {
  const {id } = req.params
  try {
    const getAnReminder = await Reminder.findOne({
      where:{id}
    })
    if(getAnReminder) return res.status(200).json({
      success: true,
      message: "Reminder fetched successfully",
      data: getAnReminder
    })
    if(!getAnReminder) return res.status(404).json({
      success: false,
      message: "Reminder not found",
      data:null
    })
  } catch (error) {
    
    throw new HttpException(error.message, 500)
  }
})

app.all('/reminders/:id', (req, res) => {

  res.status(405).send({
    message: "Method not allowed"
  })
})



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
