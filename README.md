# News Scraper

This app utilizes the Cheerio NPM package to scrape news articles from the popular music website Pitchfork. Users are presented with a splash page with two navbar options: Find New Articles, and Your Saved Articles. Clicking Find New Articles will run the request function that grabs an article title and link from pitchfork.com/latest, then pushes each entry to a MongoDB database (using Mongoose). A modal appears to confirm a successful scrape, asking the user to refresh the page, and then, the new articles will appear below the splash screen along with any other previously scraped articles.

From here, users have the option to do one of three things: click the link to proceed to view the article, click a button to save the article of their choice to be displayed on the Your Saved Articles page, or leave a comment. The comment prompt displays a modal, which asks for a user name and the comment text that are displayed at the top of the same modal after submission.
