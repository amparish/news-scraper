// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<div data-id='" + data[i]._id +
        "' class='panel panel-default'><div class='panel-heading'><h3 id='articleTitle' class='panel-title'>" + data[i].title +
        "</h3></div><div class='panel-body'><a id='articleLink' href='" + data[i].link + "'>" + data[i].link +
        "</a><br><button type='submit' class='btn btn-danger pull-right' id='commentButton'>View Comments</button><form class='navbar-form' method='POST' action='/saved/{{this.id}}?_method=PUT'><button type='submit' class='btn btn-primary pull-right' id='articleButton'>Save Article</button></form></div></div>");
    }
});

// User clicks a comment button
$("#commentButton").on("click", function() {
    // Empty the notes from the note section
    //$("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).done(function(data) {
        console.log(data);
        // The title of the article
        $("#commentSection").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#commentSection").append("<input id='titleinput' name='title'>");
        // A textarea to add a new note body
        $("#commentSection").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#commentSection").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
            $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});
  
// Save an article
$("#saveButton").on("click", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId,
        data: {
        // Value taken from title input
            title: $("#articleTitle").val(),
        // Value taken from note textarea
            link: $("#articleLink").val()
        }
    }).done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
    });
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
  