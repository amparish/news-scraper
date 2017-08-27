var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var app = express.Router();

var Article = require("../models/Article");
var Comments = require("../models/Comments");

// ROUTES

// Renders index page
app.get('/', function(req, res){
	Article.find({}, function(err, data) {
		var hbsObject = {
			article: data
		};
		res.render("index", hbsObject);
	});
});

// Renders saved articles page
app.get('/saved', function(req, res){
	Article.find({}, function(err, data) {
        var hbsObject = {
        	article: data
        };
        res.render("saved", hbsObject);
    });
});

// GET (scraper)
app.get("/scrape", function(req, res){
	request("https://www.pitchfork.com/latest", function(error, response, html){
		var $ = cheerio.load(html);
		$("h2.title").each(function(i, element){
			var result = {};
			result.link = "https://www.pitchfork.com" + $(this).parent().attr("href");
			result.title = $(this).text();

			var entry = new Article(result);

			// check for duplicate articles
			Article.update({_id: entry._id}, {$addToSet: {title: entry.title}});

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
  
  
// Create a new comment
app.post("/articles/:id", function(req, res) {
	var newComment = new Comment(req.name, req.body);
	console.log(newComment);
	// Save comment to db
	newComment.save(function(error, doc) {
		if (error) {
			console.log(error);
		} else {
		// Use the article id to find and update it's note
			Article.findOneAndUpdate({ "_id": req.params.id }, {$set: {"comment": doc._id}}, {new:true}, function(err, newdoc){
				if (err){
					console.log(error);
				} else {
					console.log(newdoc);
					res.send(newdoc);
				}
			});
		}
	});
});

// Save an article
app.get('/save/:id?', function (req, res) {
	// Save the _id to a variable
	var id = req.params.id;

	Article.findById(id, function (err, article) {
		if (err) return handleError(err);
		article.saved = true;
		//save the update in mongoDB
		article.save(function (err, updatedArticle) {
			if (err) return handleError(err);
			res.redirect("/saved");
		});
	});
});

// Delete saved article
app.get('/delete/:id?', function (req, res) {
	var id = req.params.id;
	Article.findById(id, function (err, article) {
		if (err) return handleError(err);
		article.saved = false;
		//save the update in mongoDB
		article.save(function (err, updatedArticle) {
			if (err) return handleError(err);
			res.redirect("/saved");
		});
	});
});

module.exports = app;