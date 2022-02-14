const express = require("express");
const db = require("./models");
const app = express();
const port = process.env.PORT || 3535;
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
db.sequelize.sync();
require("./routes/calender.routes")(app);


// Your TIMEOFFSET Offset
const TIMEOFFSET = '+00:00';
// Get date-time string for calender
const dateTimeForCalander = () => {
    let date = new Date();
    console.log('date:', date)
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));

    return {
        'start': startDate,
        'end': endDate
    }
};

app.listen(port, () => {
    console.log(`listening to ${port}`)
})
