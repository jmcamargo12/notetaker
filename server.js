// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

//globals
var notes = [];
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//app.get("*", function (req, res) {
//res.sendFile(path.join(__dirname, "/public/index.html"));
//});

app.get("/api/notes", function(req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf-8", function read(err, data) {
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", function(req, res) {
  var newNote = req.body;
  fs.readFile(__dirname + "/db/db.json", "utf-8", function read(err, data) {
    notes = JSON.parse(data);
    req.body.id = notes.length;
    notes.push(newNote);
    fs.writeFile(
      __dirname + "/db/db.json",
      JSON.stringify(notes),
      function read(err, data) {
        console.log("new note added");
      }
    );
  });
  res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
  var id = req.params.id;
  fs.readFile(__dirname + "/db/db.json", "utf-8", function read(err, data) {
    notes = JSON.parse(data);
    notes.splice(id, 1);
    fs.writeFile(__dirname + "/db/db.json",JSON.stringify(notes),function read(err, data) {
        console.log("poof!!");
      }
    );
  });
  res.json(id);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
