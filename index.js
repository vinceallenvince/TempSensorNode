var Router = require("routes-router");
var http = require("http");
var st = require("st");
var url = require('url');

var Keen = require("keen.io");

var app = Router();
var PORT = 8000;

// Serve all the static assets prefixed at /static
// so GET /static/js/app.js will work.
app.addRoute("/static/*", st({
    path: __dirname + "/static",
    url: "/static"
}));

app.addRoute("*", st(__dirname + "/static"));

app.addRoute("/", function (req, res) {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var projectId = query.projectId;
  var writeKey = query.writeKey;
  var temperature = query.temperature;

  var client = Keen.configure({
      projectId: projectId,
      writeKey: writeKey
  });

  if (projectId && writeKey && temperature) {

    // send single event to Keen IO
    client.addEvent("temperature", {"temperature": temperature}, function(err, res) {
        if (err) {
            console.log("Oh no, an error!");
        } else {
            console.log("Hooray, it worked! Saved temp: " + temperature);
        }
    });

  } else {
    console.log("query parameter missing!");
  }


});
var server = http.createServer(app);
server.listen(PORT);
console.log('Listening on port ' + PORT);

