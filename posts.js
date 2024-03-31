const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Post schema
const postSchema = new Schema({
  postText: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

// Create and export the Post model
module.exports = mongoose.model("Post", postSchema);
