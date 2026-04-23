"use strict";

const cors = require('cors');

const express = require("express");
const exphbs = require("express-handlebars");

// Requiring our models for syncing
const db = require("./models");

const PORT = process.env.PORT || 8080;

const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/cart-api-routes")(app);

console.log("going to html route");
app.use("/", require("./routes/html-routes"));
app.use("/cart", require("./routes/html-routes"));
app.use("/gallery", require("./routes/html-routes"));

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});

// A simple health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Optional: Check DB connection status here via Sequelize
    await sequelize.authenticate(); 
    res.status(200).send('Healthy');
  } catch (error) {
    res.status(500).send('Unhealthy');
  }
});

// CORS Options
const corsOptions = {
  // In production, this would be your VM's Public IP or Domain
  origin: process.env.PUBLIC_ORIGIN || 'http://localhost', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


const pino = require('pino-http')();

// Use structured logging middleware
app.use(pino);

// A log entry looks like this in the console:
// {"level":30,"time":1619184000,"msg":"request completed","res":{"statusCode":200},"req":{"method":"GET","url":"/api/books"}}