// User clicks a comment button
/*$(document).on("click", "#commentButton", function() {
    // Empty the notes from the note section
    //$("#notes").empty();
    // Save the id
    var thisId = $(this).attr("data-value");
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
});*/

// Save an article
$(document).on("click", "#submitComment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-value");
    console.log(thisId);
    // CURRENTLY LOGS AS UNDEFINED ON CLIENT SIDE //

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
        // Value taken from title input
            user: $("#usr").val(),
        // Value taken from note textarea
            body: $("#comment").val()
        }
    }).done(function(data) {
        // Log the response
        console.log(data);
        console.log("does this log?");
    });
});
  