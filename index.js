var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./ssl-certs/server.key'),
  cert: fs.readFileSync('./ssl-certs/server.crt')
};

// Create a service (the app object is just a callback).
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Add middleware
app.use(express.bodyParser());
app.use(express.cookieParser());


app.get("/show-cookies", function(req, res) {
  res.send("<!doctype html><html><body><pre>" + JSON.stringify(req.cookies, "  ") + "</pre></body></html>");
});

app.get("/", function(req, res) {
  var auth = false;
  if (req.cookies && req.cookies.session === "12345") {
    console.log("User is logged in via a cookie");
    // send logged in version
    auth = true;
  } else {
    console.log("User is not logged in");
  } 

  res.render('index.jade', { authenticated: auth }, function(err, html) {
    res.send(200, html);
  });
});

app.post("/login", function(req, res) {
  if (!req.connection.encrypted) {
    res.send(404, 'HTTPS required');
  } else {
    console.log('Received HTTPS POST to /login');
    console.log(req.body);
    if (req.body.email === "foo@bar.com" && req.body.password === "foobar") {
      res.cookie('session', '12345');
      res.send(200);
    } else {
      res.send(401, 'Invalid Login');
    }
  }
});

app.get("/logout", function(req, res) {
  console.log("Clearing session and logging user out");
  res.clearCookie('session');
  res.redirect('/');
});

// Serve everything from /static
app.use(express.static('static'));

// Create an HTTP service on port 8001
http.createServer(app).listen(8001);

// Create an HTTPS service on port 8002
https.createServer(options, app).listen(8002);
