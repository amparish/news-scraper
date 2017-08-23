// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
// Models
var articles = require("./models/Article.js");
var comments = require("./models/Comments.js");

mongoose.Promise = Promise;

// Express
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use("/", express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to Mongoose
mongoose.connect("mongodb://localhost");
var db = mongoose.connection;

// show mongoose errors
db.on("error", function(error){
	console.log("Mongoose error: ", error);
});

// log a success message once logged into db
db.once("open", function(){
	console.log("Mongoose connection successful");
});

// ROUTES

// Renders index page
app.get('/', function(req, res){
	res.render('index');
});

// GET (scraper)
app.get("/scrape", function(req, res){
	request("https://www.pitchfork.com/", function(error, response, html){
		var $ = cheerio.load(html);
		$("").each(function(i, element){
			var result = {};
			result.title = $(this).children("a").text();
			result.link = $(this).children("a").text();

			var entry = new articles(result);

			entry.save(function(err, doc){
				if (err){
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});
	});
	res.redirect("/");
});

app.listen(3000, function(){
	console.log("Listening on port " + PORT)
});