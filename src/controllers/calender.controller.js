const db = require("../models");
const { google } = require('googleapis');
require('dotenv').config();
const Calender = db.calender;
console.log('Calender:', Calender)

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
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
      htmlLink: data.htmlLink,
      success: data.success,
      description: req.body.description,
      startDateTime: req.body.start.dateTime,
      endDateTime: req.body.end.dateTime,
      hangoutLink: data.hangoutLink ? data.hangoutLink : null,
      createrEmail: data.creator.email,
      guestEmail: data.attendees ? data.attendees : null,

    };

    await Calender.create(calenderData)
    return res.status(201).json({ response });
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
        err.message || "Some error occurred while retrieving tutorials.",
    });
  }
};


// Delete a Tutorial with the specified id in the request
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
    return res.send({ items:data.length,data });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tutorials.",
    });
  };
};
