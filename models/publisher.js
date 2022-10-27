const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  founded: { type: Date },
  website:{ type: String }
});

// Virtual for author's URL
PublisherSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Export model
module.exports = mongoose.model("Publisher", PublisherSchema);