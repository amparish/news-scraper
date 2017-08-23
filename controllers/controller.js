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