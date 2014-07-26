var Router = require("routes-router");
var http = require("http");
var st = require("st");
var url = require('url');

var Keen = require("keen.io");

var app = Router();
var PORT = 8000;

app.addRoute("/", function (req, res) {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var projectId = query.projectId;
  var writeKey = query.writeKey;
  var temperature = query.temperature;
  var msg = "";

  if (!projectId || !writeKey) {
    msg = "projectId and writeKey are required.";
    console.log(msg);
    res.end(msg);
    return;
  }

  var client = Keen.configure({
      projectId: projectId,
      writeKey: writeKey
  });

  // res.writeHead(200, { "Content-Type": "text/html" });

  if (projectId && writeKey && temperature) {

    // send single event to Keen IO
    client.addEvent("temperature", {"temperature": temperature}, function(err, result) {
        if (err) {
            msg = "Oh no, an error!";
            console.log(msg);
            res.end(msg);
        } else {
            msg = "Hooray, it worked! Saved temp: " + temperature;
            console.log(msg);
            res.end(msg);
        }
    });

  } else {
    msg = "query parameter missing!";
    console.log(msg);
    res.end(msg);
  }


});
var server = http.createServer(app);
server.listen(PORT);
console.log('Listening on port ' + PORT);

