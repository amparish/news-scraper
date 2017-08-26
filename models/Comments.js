var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    user: {
        type: String
    },
    body: {
        type: String
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;