var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var app = express.Router();

var Article = require("../models/Article");
var Comments = require("../models/Comments");

// ROUTES

// Renders saved articles page
app.get('/saved', function(req, res){
	res.render('saved');
});

// GET (scraper)
app.get("/scrape", function(req, res){
	request("https://www.pitchfork.com/", function(error, response, html){
		var $ = cheerio.load(html);
		$("h2.title").each(function(i, element){
			var result = {};
			result.link = "https://www.pitchfork.com" + $(this).parent().attr("href");
			result.title = $(this).text();

			var entry = new Article(result);

			entry.save(function(err, doc){
				if (err){
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});
	});
});

// Route to display scraped articles as JSON
app.get("/articles", function(req, res) {
	// Find all
	Article.find({}, function(error, doc) {
	  if (error) {
			console.log(error);
	  } else {
			res.json(doc);
	  }
	});
});
  
// Displays single article (selected by ID) as JSON, with comments
app.get("/articles/:id", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	Article.findOne({ "_id": req.params.id })
// and populate all of the comments associated with it
	.populate("comments")
	.exec(function(error, doc) {
	// Log any errors
		if (error) {
			console.log(error);
		} else {
			res.json(doc);
		}
	});
});
  
  
  // Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
	// Create a new note and pass the req.body to the entry
		var newComment = new Comment(req.body);
		
		// And save the new note the db
		newComment.save(function(error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		} else {
		// Use the article id to find and update it's note
			Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
		// Execute the above query
			.exec(function(err, doc) {
			// Log any errors
				if (err) {
					console.log(err);
				} else {
			// Or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});

module.exports = app;