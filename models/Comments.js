var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;