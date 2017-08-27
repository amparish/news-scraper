// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
// Models
var article = require("./models/Article.js");
var comment = require("./models/Comments.js");

mongoose.Promise = Promise;

// Express
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use("/", express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/controller.js");

app.use("/", routes);

// Connect to Mongoose
if (process.env.MONGODB_URI) {
	mongoose.connect("mongodb://heroku_7ckcb3gc:pc8tifg5od9ofgtcghn48kg86m@ds155587.mlab.com:55587/heroku_7ckcb3gc");
} else {
	mongoose.connect("mongodb://localhost/news-scraper");
}

var db = mongoose.connection;

// show mongoose errors
db.on("error", function(error){
	console.log("Mongoose error: ", error);
});

// log a success message once logged into db
db.once("open", function(){
	console.log("Mongoose connection successful");
});

// Renders index page
app.get('/', function(req, res){
	res.render('index');
});

app.listen(3000, function(){
	console.log("Listening on port " + PORT);
});