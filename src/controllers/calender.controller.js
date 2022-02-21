const db = require("../models");
const { google } = require('googleapis');
require('dotenv').config();
const Calender = db.calender;

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const calendarId = process.env.CALENDAR_ID;
// Google calendar API settings
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];
const calendar = google.calendar({ version: "v3" });
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
// Create and Save a new calender event
exports.create = async (req, res) => {
  try {
    let response = await calendar.events.insert({
      auth,
      calendarId: calendarId,
      resource: req.body
    });
    const { data } = response
    const calenderData = {
      googleid: data.id,
      status: data.status,
      summary: req.body.summary,
      htmlLink: data.htmlLink,
      success: data.success,
      description: req.body.description,
      startDateTime: req.body.start.dateTime,
      endDateTime: req.body.end.dateTime,
      hangoutLink: req.body.hangoutLink ? req.body.hangoutLink : null,
      createrEmail: data.creator.email,
      guestEmail: req.body.attendees ? req.body.attendees : null,
    };

    const dbdata = await Calender.create(calenderData)
    return res.status(201).json({ dbdata });
  } catch (error) {
    return res.status(404).json(error);
  }
};

// Retrieve all events from the database.
exports.findAll = async (req, res) => {
  try {
    let response = await calendar.events.list({
      auth: auth,
      calendarId: calendarId,
      timeMin: req.body.dateTimeStart,
      timeMax: req.body.dateTimeEnd,
      timeZone: 'Asia/Kolkata'
    });
    let items = response['data']['items'];
    return res.status(200).json({ length: items.length, items });
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving events.",
    });
  }
};


// Delete a event with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    let response = await calendar.events.delete({
      auth: auth,
      calendarId: calendarId,
      eventId: id
    });
    await Calender.destroy({
      where: { googleid: id },
    })
    return res.status(200).json({ response });
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error}`);
    return res.status(404).json(error);
  }
};

// find all published events from db
exports.findAllfromdb = async (req, res) => {
  try {
    let data = await Calender.findAll()
    return res.send({ items: data.length, data });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving events.",
    });
  };
};

// find all published events from db
exports.findAllBookedSlots = async (req, res) => {
  try {
    let new1 = await Calender.findAll()
    const data = new1.filter((e) => {
      return e.startDateTime.slice(0, 10) == req.body.date
    })
    return res.send({ items: data.length, data });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving events.",
    });
  };
};


// find all published events from db
exports.findAllAvailableSlots = async (req, res) => {
  let AllSlots = ["09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45"]
  try {
    let new1 = await Calender.findAll()
    const data = new1.filter((e) => {
      return e.startDateTime.slice(0, 10) == req.body.date

    })
    let data1 = data.map((e) => {
      return e.startDateTime.slice(11, 16)
    })
    return res.send({
      data: AllSlots.filter((e) => {
        return data1.indexOf(e) === -1
      })
    });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving events.",
    });
  };
};