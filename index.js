const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const schedule = require("node-schedule");

const app = express();

// set static path
app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());

const publicVapidKey =
  "BARuE7TAjgUvNzecIG9dv1w9L6_G_GO97474vA87neP16uSV7XmFK-Jec2NTQKhYONQatWaIgnIn1YLE_jS89-8";

const privateVapidKey = "bwy4dQkzGOZd5Q3khlVXnjWhVT-DFOXgTGsKzan7eFs";

webPush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({ title: "Push Test" });

  schedule.scheduleJob("*/2 * * * * *", function () {
    // pass object into sendNotification
    webPush
      .sendNotification(subscription, payload)
      .catch((err) => console.error(err));
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
