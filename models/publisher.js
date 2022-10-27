const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  founded: { type: Date },
  website:{ type: String }
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death? 
  DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED):"";
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);