const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  founded: { type: Date },
  website:{ type: String }
});

// Virtual for publisher's URL
PublisherSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/publisher/${this._id}`;
});

// Virtual for publisher's date
PublisherSchema.virtual("founded_date").get(function () {
  // We don't use an arrow function as we'll need the this object
  return this.founded?
  DateTime.fromJSDate(this.founded).toLocaleString(DateTime.DATE_MED):"";
});
// Export model
module.exports = mongoose.model("Publisher", PublisherSchema);